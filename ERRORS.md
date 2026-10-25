# Project Error Log & Solutions

This document tracks all errors, bugs, build failures, and configuration issues encountered during the development, build, deployment, and testing of the CarshowRoom Web Application, along with their root causes and resolutions.

---

## 📋 Error Entry Template

When logging a new error, copy and paste the template below to the top of the **Logged Errors** section.

```markdown
### [ERR-XXX] Short Title / Description of the Error

- **Date:** YYYY-MM-DD
- **Environment:** Local / Docker / Kubernetes / CI/CD pipeline / Browser
- **Component / File:** e.g., `src/pages/HomePage.tsx`, `nginx.conf`, `Dockerfile`

#### 1. Error Symptoms & Message
Provide the exact error message, terminal output, or screenshot/log snippet:
```
[Paste error log or stack trace here]
```

#### 2. Root Cause
Explain why the issue occurred.

#### 3. Resolution / Solution
Explain step-by-step how the issue was fixed, including commands run or code modified.

#### 4. Prevention / Verification
How was the fix verified? What can be done to prevent this issue from recurring?
```

---

## 📝 Logged Errors

### [ERR-003] Terraform Backend Configuration Changed Error (`terraform init`)

- **Date:** 2026-10-25
- **Environment:** GitHub Actions CI/CD Pipeline (`infra-terraform.yaml`)
- **Component / File:** `terraform-aks/backend.tf`, `.github/workflows/infra-terraform.yaml`

#### 1. Error Symptoms & Message
```
Initializing the backend...
╷
│ Error: Backend configuration changed
│ 
│ A change in the backend configuration has been detected, which may require
│ migrating existing state.
│ 
│ If you wish to attempt automatic migration of the state, use "terraform
│ init -migrate-state".
│ If you wish to store the current configuration with no changes to the
│ state, use "terraform init -reconfigure".
```

#### 2. Root Cause
In CI/CD environments where a remote backend (`backend "azurerm"`) is configured or updated, running plain `terraform init` without flags detects a configuration discrepancy and pauses for interactive confirmation. Since pipelines run non-interactively, Terraform exits with an error.

#### 3. Resolution / Solution
Update the workflow step in `.github/workflows/infra-terraform.yaml` from `terraform init` to `terraform init -reconfigure`:
```yaml
      - name: Terraform Init
        run: |
          terraform init -reconfigure
```

#### 4. Prevention / Verification
Always use `terraform init -reconfigure` in automated pipelines where backend parameters or states are initialized across clean runner instances.

---

### [ERR-002] Azure Login Failure - AADSTS700016 Application Not Found in Directory

- **Date:** 2026-10-25
- **Environment:** GitHub Actions CI/CD Pipeline (`azure/login@v3`)
- **Component / File:** `.github/workflows/infra-terraform.yaml`, GitHub Repository Secrets (`AZURE_CREDENTIALS`)

#### 1. Error Symptoms & Message
```
Attempting Azure CLI login by using service principal with secret...
Error: AADSTS700016: Application with identifier '***' was not found in the directory '***'. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You may have sent your authentication request to the wrong tenant.
Error: Run the command below to authenticate interactively...
Error: Login failed with Error: The process '/usr/bin/az' failed with exit code 1.
```

#### 2. Root Cause
The Service Principal `clientId` and/or `tenantId` provided in the GitHub repository secret `AZURE_CREDENTIALS` does not match the Azure Active Directory / Entra ID tenant where the user/subscription resides, or the application registration does not exist. The correct Tenant ID for this lab environment is `30fe8ff1-adc6-444d-ba94-1238894df42c`.

#### 3. Resolution / Solution
1. Verify that the `clientId` and `clientSecret` correspond to an active App Registration in your Azure Tenant (`30fe8ff1-adc6-444d-ba94-1238894df42c`).
2. Ensure the GitHub secret `AZURE_CREDENTIALS` contains the correct JSON structure with the matching `tenantId`:
```json
{
  "clientId": "CORRECT_CLIENT_ID",
  "clientSecret": "CORRECT_CLIENT_SECRET",
  "subscriptionId": "a2b28c85-1948-4263-90ca-bade2bac4df4",
  "tenantId": "30fe8ff1-adc6-444d-ba94-1238894df42c"
}
```
3. Update the `AZURE_CREDENTIALS` secret in GitHub Settings > Secrets and variables > Actions.

#### 4. Prevention / Verification
Re-run the GitHub Actions workflow after updating the repository secret with valid Service Principal credentials for the correct tenant.

---

### [ERR-001] AuthorizationFailed when creating Azure Service Principal (`az ad sp create-for-rbac`)

- **Date:** 2026-10-25
- **Environment:** Azure CLI / GitHub Actions Setup / Lab Environment
- **Component / File:** Azure Subscription & IAM Permissions

#### 1. Error Symptoms & Message
```
(AuthorizationFailed) The client 'kk_lab_user_main-0810375e0ea74db3@azurekmlprodkodekloud.onmicrosoft.com' with object id 'e923a9c2-2b65-4aa0-93ed-239e9c4c700c' does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/a2b28c85-1948-4263-90ca-bade2bac4df4/providers/Microsoft.Authorization/roleAssignments/...' or the scope is invalid.
```

#### 2. Root Cause
The current logged-in Azure account is a lab user or standard user without permissions to create Azure Active Directory applications/service principals or assign IAM role assignments (`Microsoft.Authorization/roleAssignments/write`).

#### 3. Resolution / Solution
In restricted lab environments where you cannot create Service Principals:
1. Check if lab instructions or pre-configured secrets provide existing Azure service principal credentials (Client ID, Client Secret, Tenant ID).
2. If working locally or testing via Azure CLI directly, you are already authenticated as the user (`kk_lab_user_main-...`), so you do not need a service principal for local testing or Terraform execution (Terraform uses provider config or user credentials).
3. If running in GitHub Actions without admin rights to create an SP, check with your lab administrator or platform provider for the provisioned `AZURE_CREDENTIALS` secret.

#### 4. Prevention / Verification
Verified via `az account show` that the user account is active, but role assignment creation requires subscription administrator privileges.
