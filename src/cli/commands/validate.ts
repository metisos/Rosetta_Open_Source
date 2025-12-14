/**
 * rosetta validate command
 * Check Rosetta files for structural issues
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import {
  parseRosettaFile,
  validateSections,
  parseModuleIndex,
  REQUIRED_SECTIONS,
  REQUIRED_MODULE_SECTIONS,
} from '../utils/parser';

export interface ValidateOptions {
  path?: string;
}

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export async function validateCommand(options: ValidateOptions): Promise<void> {
  const targetPath = options.path || process.cwd();
  const rosettaPath = path.join(targetPath, 'ROSETTA.md');
  const rosettaDir = path.join(targetPath, '.rosetta');

  const result: ValidationResult = {
    errors: [],
    warnings: [],
  };

  console.log(chalk.cyan('Rosetta Validation Report'));
  console.log(chalk.gray('═'.repeat(40)));
  console.log();

  // Check ROSETTA.md exists
  if (!fs.existsSync(rosettaPath)) {
    console.log(chalk.red('✗') + ' ROSETTA.md not found');
    console.log();
    console.log(chalk.yellow("Run 'rosetta init' to initialize Rosetta"));
    return;
  }

  // Parse and validate ROSETTA.md
  console.log(chalk.white('ROSETTA.md'));
  const rosettaContent = fs.readFileSync(rosettaPath, 'utf-8');
  const parsed = parseRosettaFile(rosettaContent);
  const sectionValidation = validateSections(parsed, REQUIRED_SECTIONS);

  for (const section of sectionValidation.found) {
    console.log(chalk.green('  ✓') + ` ${section} section present`);
  }

  for (const section of sectionValidation.missing) {
    console.log(chalk.red('  ✗') + ` ${section} section missing`);
    result.errors.push(`Missing section: ${section}`);
  }

  // Check metadata
  if (parsed.metadata.lastUpdated) {
    const lastUpdated = new Date(parsed.metadata.lastUpdated);
    const daysSince = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince > 30) {
      console.log(chalk.yellow('  ⚠') + ` Last updated ${daysSince} days ago`);
      result.warnings.push(`ROSETTA.md last updated ${daysSince} days ago`);
    }
  } else {
    console.log(chalk.yellow('  ⚠') + ' No last-updated metadata found');
    result.warnings.push('No last-updated metadata in ROSETTA.md');
  }

  console.log();

  // Parse module index and check files exist
  const moduleIndex = parseModuleIndex(rosettaContent);
  console.log(chalk.white('Module Index'));

  if (moduleIndex.length === 0) {
    console.log(chalk.yellow('  ⚠') + ' No modules defined in index');
    result.warnings.push('No modules defined in Module Index');
  } else {
    for (const module of moduleIndex) {
      if (!module.module || !module.path) continue;

      const modulePath = path.join(targetPath, module.path);
      if (fs.existsSync(modulePath)) {
        console.log(chalk.green('  ✓') + ` ${module.module}.md exists`);
      } else {
        console.log(chalk.red('  ✗') + ` ${module.module}.md missing (${module.path})`);
        result.errors.push(`Module file missing: ${module.path}`);
      }
    }
  }

  console.log();

  // Validate module files
  const modulesDir = path.join(rosettaDir, 'modules');
  if (fs.existsSync(modulesDir)) {
    const moduleFiles = fs.readdirSync(modulesDir).filter(f => f.endsWith('.md'));

    if (moduleFiles.length > 0) {
      console.log(chalk.white('Module Files'));

      for (const moduleFile of moduleFiles) {
        const modulePath = path.join(modulesDir, moduleFile);
        const moduleContent = fs.readFileSync(modulePath, 'utf-8');
        const moduleParsed = parseRosettaFile(moduleContent);
        const moduleValidation = validateSections(moduleParsed, REQUIRED_MODULE_SECTIONS);

        if (moduleValidation.valid) {
          console.log(chalk.green('  ✓') + ` ${moduleFile} structure valid`);
        } else {
          console.log(chalk.red('  ✗') + ` ${moduleFile} missing sections: ${moduleValidation.missing.join(', ')}`);
          result.errors.push(`${moduleFile} missing sections: ${moduleValidation.missing.join(', ')}`);
        }

        // Check module staleness
        if (moduleParsed.metadata.lastVerified) {
          const lastVerified = new Date(moduleParsed.metadata.lastVerified);
          const daysSince = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSince > 30) {
            console.log(chalk.yellow('    ⚠') + ` last-verified: ${daysSince} days ago`);
            result.warnings.push(`${moduleFile} last-verified ${daysSince} days ago`);
          }
        }
      }
    }
  }

  // Summary
  console.log();
  console.log(chalk.gray('─'.repeat(40)));

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green('✓ All checks passed'));
  } else {
    console.log(
      `Summary: ${result.errors.length > 0 ? chalk.red(`${result.errors.length} error(s)`) : '0 errors'}, ` +
        `${result.warnings.length > 0 ? chalk.yellow(`${result.warnings.length} warning(s)`) : '0 warnings'}`
    );
  }

  // Exit with error code if there are errors
  if (result.errors.length > 0) {
    process.exitCode = 1;
  }
}
