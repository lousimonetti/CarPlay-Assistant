# Azure OpenAI configuration

This repo supports Azure OpenAI (Foundry Models) using the **v1** data plane APIs.

## Required settings

Set Wrangler vars:
- `LLM_PROVIDER="azure_openai"`
- `AZURE_OPENAI_ENDPOINT="https://<your-resource-name>.openai.azure.com"`
- `AZURE_OPENAI_MODEL="<your-deployment-name>"`

Set Worker secrets:
- `AZURE_OPENAI_API_KEY`

Azure key-based auth uses the `api-key` header. Azure also supports Microsoft Entra ID authentication. citeturn1view1

## Notes
- Azure’s v1 APIs reduce the need to manage monthly `api-version` updates and are designed to align with OpenAI client semantics. citeturn1view3turn1view1
- The Azure **Responses API** is region-scoped. Ensure your Azure OpenAI resource is in a supported region. citeturn1view0
