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
