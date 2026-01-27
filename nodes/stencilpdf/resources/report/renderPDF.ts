import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRenderPDF = {
	resource: ['report'],
	operation: ['renderPDF'],
};

export const renderPDFDescription: INodeProperties[] = [
	{
		displayName: 'Report Name or ID',
		description: 'The report to render. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		name: 'reportID',
		type: 'options',
		required: true,
		displayOptions: { show: showOnlyForRenderPDF },
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getReports',
		},
	},
	{
		displayName: 'Variables Input',
		name: 'variablesInput',
		type: 'options',
		displayOptions: { show: showOnlyForRenderPDF },
		options: [
			{
				name: 'From JSON',
				value: 'json',
			},
			{
				name: 'Structured',
				value: 'structured',
			},
		],
		default: 'structured',
		description: 'How to provide the template variables',
	},
	{
		displayName: 'Variables (JSON)',
		name: 'variablesJson',
		type: 'json',
		displayOptions: {
			show: {
				...showOnlyForRenderPDF,
				variablesInput: ['json'],
			},
		},
		default: '{}',
		description: 'Variables as JSON object',
	},
	{
		displayName: 'Variables',
		name: 'variables',
		type: 'resourceMapper',
		noDataExpression: true,
		displayOptions: {
			show: {
				...showOnlyForRenderPDF,
				variablesInput: ['structured'],
			},
		},
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		typeOptions: {
			loadOptionsDependsOn: ['reportID'],
			resourceMapper: {
				resourceMapperMethod: 'getReportVariableFields',
				mode: 'add',
				fieldWords: {
					singular: 'variable',
					plural: 'variables',
				},
				addAllFields: false,
				multiKeyMatch: false,
			},
		},
	},
];
