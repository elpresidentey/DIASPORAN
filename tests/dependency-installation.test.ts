/**
 * Feature: dettyconnect-bug-fixes, Property 1: Dependency Installation Completeness
 * 
 * Property: For any package listed in package.json dependencies or devDependencies,
 * after installation, that package should exist in the node_modules directory with
 * a valid package.json file
 * 
 * Validates: Requirements 1.1
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Property 1: Dependency Installation Completeness', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const nodeModulesPath = path.join(projectRoot, 'node_modules');

  // Read package.json to get all dependencies
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const dependencyNames = Object.keys(allDependencies);

  it('should have all dependencies installed in node_modules with valid package.json', () => {
    // Property-based test: for any dependency in package.json,
    // it should exist in node_modules with a valid package.json
    fc.assert(
      fc.property(
        fc.constantFrom(...dependencyNames),
        (dependencyName) => {
          const dependencyPath = path.join(nodeModulesPath, dependencyName);
          const dependencyPackageJsonPath = path.join(dependencyPath, 'package.json');

          // Check that the dependency directory exists
          const dependencyExists = fs.existsSync(dependencyPath);
          
          // Check that the dependency has a package.json file
          const hasPackageJson = fs.existsSync(dependencyPackageJsonPath);
          
          // If both exist, verify the package.json is valid JSON
          let isValidPackageJson = false;
          if (hasPackageJson) {
            try {
              const depPackageJson = JSON.parse(
                fs.readFileSync(dependencyPackageJsonPath, 'utf-8')
              );
              // Verify it has at least a name field
              isValidPackageJson = typeof depPackageJson.name === 'string';
            } catch (error) {
              isValidPackageJson = false;
            }
          }

          return dependencyExists && hasPackageJson && isValidPackageJson;
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  it('should verify all dependencies are present (exhaustive check)', () => {
    // Additional exhaustive check to ensure we test all dependencies
    const missingDependencies: string[] = [];
    const invalidDependencies: string[] = [];

    for (const dependencyName of dependencyNames) {
      const dependencyPath = path.join(nodeModulesPath, dependencyName);
      const dependencyPackageJsonPath = path.join(dependencyPath, 'package.json');

      if (!fs.existsSync(dependencyPath)) {
        missingDependencies.push(dependencyName);
        continue;
      }

      if (!fs.existsSync(dependencyPackageJsonPath)) {
        invalidDependencies.push(`${dependencyName} (missing package.json)`);
        continue;
      }

      try {
        const depPackageJson = JSON.parse(
          fs.readFileSync(dependencyPackageJsonPath, 'utf-8')
        );
        if (typeof depPackageJson.name !== 'string') {
          invalidDependencies.push(`${dependencyName} (invalid package.json)`);
        }
      } catch (error) {
        invalidDependencies.push(`${dependencyName} (malformed package.json)`);
      }
    }

    expect(missingDependencies).toEqual([]);
    expect(invalidDependencies).toEqual([]);
  });
});

/**
 * Feature: dettyconnect-bug-fixes, Property 2: Dependency Version Matching
 * 
 * Property: For any installed package in node_modules, the installed version
 * should match or satisfy the version constraint specified in package.json
 * 
 * Validates: Requirements 1.2
 */

describe('Property 2: Dependency Version Matching', () => {
  const projectRoot = path.resolve(__dirname, '..');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const nodeModulesPath = path.join(projectRoot, 'node_modules');

  // Read package.json to get all dependencies with their version constraints
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const allDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const dependencyEntries = Object.entries(allDependencies);

  /**
   * Helper function to check if an installed version satisfies a version constraint
   * This is a simplified version checker that handles common npm version patterns:
   * - Exact versions: "1.2.3"
   * - Caret ranges: "^1.2.3" (allows changes that don't modify left-most non-zero digit)
   * - Tilde ranges: "~1.2.3" (allows patch-level changes)
   */
  function satisfiesVersion(installedVersion: string, constraint: string): boolean {
    // Remove any 'v' prefix from installed version
    const cleanInstalled = installedVersion.replace(/^v/, '');
    const cleanConstraint = constraint.trim();

    // Handle exact version match
    if (!cleanConstraint.startsWith('^') && !cleanConstraint.startsWith('~')) {
      return cleanInstalled === cleanConstraint;
    }

    // Parse version numbers
    const parseVersion = (v: string) => {
      const match = v.match(/^[\^~]?(\d+)\.(\d+)\.(\d+)/);
      if (!match) return null;
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: parseInt(match[3], 10),
      };
    };

    const installed = parseVersion(cleanInstalled);
    const required = parseVersion(cleanConstraint);

    if (!installed || !required) {
      // If we can't parse, consider it satisfied (edge case handling)
      return true;
    }

    // Handle caret (^) - allows changes that don't modify left-most non-zero digit
    if (cleanConstraint.startsWith('^')) {
      if (required.major > 0) {
        // ^1.2.3 := >=1.2.3 <2.0.0
        return (
          installed.major === required.major &&
          (installed.minor > required.minor ||
            (installed.minor === required.minor && installed.patch >= required.patch))
        );
      } else if (required.minor > 0) {
        // ^0.2.3 := >=0.2.3 <0.3.0
        return (
          installed.major === 0 &&
          installed.minor === required.minor &&
          installed.patch >= required.patch
        );
      } else {
        // ^0.0.3 := >=0.0.3 <0.0.4
        return (
          installed.major === 0 &&
          installed.minor === 0 &&
          installed.patch === required.patch
        );
      }
    }

    // Handle tilde (~) - allows patch-level changes
    if (cleanConstraint.startsWith('~')) {
      // ~1.2.3 := >=1.2.3 <1.3.0
      return (
        installed.major === required.major &&
        installed.minor === required.minor &&
        installed.patch >= required.patch
      );
    }

    return false;
  }

  it('should have installed versions that satisfy package.json constraints', () => {
    // Property-based test: for any dependency in package.json,
    // the installed version should satisfy the version constraint
    fc.assert(
      fc.property(
        fc.constantFrom(...dependencyEntries),
        ([dependencyName, versionConstraint]) => {
          const dependencyPackageJsonPath = path.join(
            nodeModulesPath,
            dependencyName,
            'package.json'
          );

          // Skip if dependency doesn't exist (will be caught by Property 1)
          if (!fs.existsSync(dependencyPackageJsonPath)) {
            return true;
          }

          try {
            const depPackageJson = JSON.parse(
              fs.readFileSync(dependencyPackageJsonPath, 'utf-8')
            );
            const installedVersion = depPackageJson.version;

            if (typeof installedVersion !== 'string') {
              return false;
            }

            return satisfiesVersion(installedVersion, versionConstraint as string);
          } catch (error) {
            // If we can't read the package.json, fail the property
            return false;
          }
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in the design
    );
  });

  it('should verify all dependency versions match constraints (exhaustive check)', () => {
    // Additional exhaustive check to provide detailed feedback
    const versionMismatches: string[] = [];

    for (const [dependencyName, versionConstraint] of dependencyEntries) {
      const dependencyPackageJsonPath = path.join(
        nodeModulesPath,
        dependencyName,
        'package.json'
      );

      if (!fs.existsSync(dependencyPackageJsonPath)) {
        // Skip missing dependencies (handled by Property 1)
        continue;
      }

      try {
        const depPackageJson = JSON.parse(
          fs.readFileSync(dependencyPackageJsonPath, 'utf-8')
        );
        const installedVersion = depPackageJson.version;

        if (typeof installedVersion !== 'string') {
          versionMismatches.push(
            `${dependencyName}: missing version in package.json`
          );
          continue;
        }

        if (!satisfiesVersion(installedVersion, versionConstraint as string)) {
          versionMismatches.push(
            `${dependencyName}: installed ${installedVersion} does not satisfy ${versionConstraint}`
          );
        }
      } catch (error) {
        versionMismatches.push(
          `${dependencyName}: error reading package.json - ${error}`
        );
      }
    }

    expect(versionMismatches).toEqual([]);
  });
});
