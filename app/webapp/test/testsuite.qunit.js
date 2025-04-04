sap.ui.define(function () {
	"use strict";

	return {
		name: "QUnit test suite for the UI5 Application: newjoiner",
		defaults: {
			page: "ui5://test-resources/newjoiner/Test.qunit.html?testsuite={suite}&test={name}",
			qunit: {
				version: 2
			},
			sinon: {
				version: 1
			},
			ui5: {
				language: "EN",
				theme: "sap_horizon"
			},
			coverage: {
				only: "newjoiner/",
				never: "test-resources/newjoiner/"
			},
			loader: {
				paths: {
					"newjoiner": "../"
				}
			}
		},
		tests: {
			"unit/unitTests": {
				title: "Unit tests for newjoiner"
			},
			"integration/opaTests": {
				title: "Integration tests for newjoiner"
			}
		}
	};
});
