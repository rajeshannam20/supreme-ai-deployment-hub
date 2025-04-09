
// Main export file for Terraform configuration
import { commonConfigYaml } from './common';
import { vpcConfigYaml } from './vpc';
import { eksConfigYaml } from './eks'; 
import { rdsConfigYaml } from './rds';
import { kubernetesConfigYaml } from './kubernetes';
import { variablesConfigYaml } from './variables';
import { outputsConfigYaml } from './outputs';

// Combine all Terraform configuration sections
export const terraformManifestYaml = `${commonConfigYaml}

${vpcConfigYaml}

${eksConfigYaml}

${rdsConfigYaml}

${kubernetesConfigYaml}

${variablesConfigYaml}

${outputsConfigYaml}`;
