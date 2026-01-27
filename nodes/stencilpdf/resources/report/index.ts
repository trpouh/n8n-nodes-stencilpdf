import type { INodeProperties } from 'n8n-workflow';
import { renderPDFDescription } from './renderPDF';

const showOnlyForReports = {
	resource: ['report'],
};

export const reportDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForReports,
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get reports',
				description: 'Get many reports',
			},
			{
				name: 'Render PDF',
				value: 'renderPDF',
				action: 'Render PDF',
				description: 'Render a report template as PDF',
			},
		],
		default: 'getMany',
	},
	...renderPDFDescription,
];
