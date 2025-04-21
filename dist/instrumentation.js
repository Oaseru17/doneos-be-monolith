"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const exporterOptions = {
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
};
const traceExporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter(exporterOptions);
const sdk = new sdk_node_1.NodeSDK({
    resource: new resources_1.Resource({
        [semantic_conventions_1.SEMRESATTRS_SERVICE_NAME]: 'my-service',
    }),
    traceExporter,
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()]
});
sdk.start();
