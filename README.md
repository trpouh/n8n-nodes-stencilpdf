# n8n-nodes-stencilpdf

This is an n8n community node. It lets you use StencilPDF in your n8n workflows.

StencilPDF is a service for generating PDFs from customizable templates with dynamic variables.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Report

- **Get Many**: Retrieve a list of all available report templates from your StencilPDF account
- **Render PDF**: Generate a PDF from a report template by providing variable values. Returns the PDF as binary data.

## Credentials

To use this node, you need a StencilPDF API key.

1. Sign up for an account at [stencilpdf.com](https://stencilpdf.com)
2. Navigate to your account settings to generate an API key. It will start with `rbk_`
3. In n8n, create new credentials of type "StencilPDF API"
4. Enter your API key

## Compatibility

Tested with n8n version 2.4.6

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [StencilPDF](https://stencilpdf.com)