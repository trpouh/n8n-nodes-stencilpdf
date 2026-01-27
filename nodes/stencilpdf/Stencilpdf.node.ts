import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	ResourceMapperFields,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError } from 'n8n-workflow';
import { reportDescription } from './resources/report';

export class Stencilpdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'StencilPDF',
		name: 'stencilpdf',
		subtitle: 'stencilpdf',
		icon: { light: 'file:logo.svg', dark: 'file:logo.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Generate PDF Reports from templates using stencil',
		defaults: {
			name: 'StencilPDF',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'stencilpdfApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Report',
						value: 'report',
					},
				],
				default: 'report',
			},
			...reportDescription,
		],
	};

	methods = {
		loadOptions: {
			async getReports(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'stencilpdfApi', {
					method: 'GET',
					url: 'https://app.stencilpdf.com/api/reports',
					json: true,
				});

				return response.reports.map(
					(report: { name: string; organizationName: string; id: string }) => ({
						name: `${report.name} (${report.organizationName})`,
						value: report.id,
					}),
				);
			},
		},

		resourceMapping: {
			async getReportVariableFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
				const reportId = this.getCurrentNodeParameter('reportID') as string;

				if (!reportId) {
					return { fields: [] };
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'stencilpdfApi', {
					method: 'GET',
					url: `https://app.stencilpdf.com/api/reports/${reportId}/variables`,
					json: true,
				});

				const { variables } = response as {
					variables: Array<{ name: string; defaultValue?: string; isArray?: boolean }>;
				};

				return {
					fields: variables.map((variable) => ({
						id: variable.name,
						displayName: variable.name,
						required: false,
						defaultMatch: false,
						canBeUsedToMatch: false,
						display: true,
						type: 'string' as const,
						defaultValue: variable.defaultValue ?? '',
					})),
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			if (resource === 'report') {
				if (operation === 'getMany') {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'stencilpdfApi',
						{
							method: 'GET',
							url: 'https://app.stencilpdf.com/api/reports',
							json: true,
						},
					);
					const reports = response.reports || response;
					if (Array.isArray(reports)) {
						for (const report of reports) {
							returnData.push({ json: report, pairedItem: i });
						}
					} else {
						returnData.push({ json: response, pairedItem: i });
					}
				}

				if (operation === 'renderPDF') {
					const reportId = this.getNodeParameter('reportID', i) as string;
					const variablesInput = this.getNodeParameter('variablesInput', i) as string;

					let variables: Record<string, unknown> = {};

					if (variablesInput === 'json') {
						const variablesJson = this.getNodeParameter('variablesJson', i) as string;
						variables = JSON.parse(variablesJson);
					} else {
						const resourceMapperData = this.getNodeParameter('variables', i) as {
							value: Record<string, unknown>;
						};
						variables = resourceMapperData?.value || {};
					}

					try {
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'stencilpdfApi',
							{
								method: 'POST',
								url: `https://app.stencilpdf.com/api/reports/${reportId}/generate-pdf`,
								body: JSON.stringify({ variables }),
								headers: {
									'Content-Type': 'application/json',
								},
								encoding: 'document',
							},
						);

						const binaryData = await this.helpers.prepareBinaryData(
							Buffer.from(response as Buffer),
							`${reportId}.pdf`,
							'application/pdf',
						);

						returnData.push({
							json: {},
							binary: { data: binaryData },
							pairedItem: i,
						});
					} catch (error) {
						throw new NodeApiError(this.getNode(), error);
					}
				}
			}
		}

		return [returnData];
	}
}
