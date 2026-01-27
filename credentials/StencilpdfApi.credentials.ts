import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class StencilpdfApi implements ICredentialType {
	name = 'stencilpdfApi';

	displayName = 'Stencilpdf API';

	// Link to your community node's README
	documentationUrl = 'https://github.com/org/-stencilpdf?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.stencilpdf.com/api',
			url: '/reports',
		},
	};

	icon: Icon = {
		light: 'file:./../nodes/stencilpdf/logo.svg',
		dark: 'file:./../nodes/stencilpdf/logo.dark.svg',
	};
}
