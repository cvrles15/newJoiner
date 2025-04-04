sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("newJoiner.controller.QuizView", {
        onEnvironmentSelect: function () {
            let sName = this.getView().byId("environmentSelect").getSelectedButton().getText();
            let oView = this.getView();
			let oWizard = oView.byId("quizWizard");

            // Adaptar los pasos según el entorno seleccionado
            if (sName.includes("UI5")) {
                oView.byId("step2UI5").setVisible(true);
                oView.byId("step2ABAP").setVisible(false);
				oWizard.goToStep(oView.byId("step2UI5"));
            } else {
                oView.byId("step2ABAP").setVisible(true);
                oView.byId("step2UI5").setVisible(false);
				oWizard.goToStep(oView.byId("step2ABAP"));
            }
        },

        onWizardComplete: function () {
            let oView = this.getView();
            let sEnvironment = oView.byId("environmentSelect").getSelectedButton().getText();

            // Recolectar respuestas según el entorno seleccionado
            let aAnswers = [];
            if (sEnvironment === "SAP BTP Fiori/UI5") {
                aAnswers.push({
                    skill: "JavaScript",
                    level: oView.byId("jsSkill").getSelectedButton().getText()
                });
                aAnswers.push({
                    skill: "SAP HANA",
                    level: oView.byId("hanaSkill").getSelectedButton().getText()
                });
                aAnswers.push({
                    skill: "CSS/HTML",
                    level: oView.byId("cssHtmlSkill").getSelectedButton().getText()
                });
                aAnswers.push({
                    skill: "OData Services",
                    level: oView.byId("odataSkill").getSelectedButton().getText()
                });
            } else if (sEnvironment === "SAP ABAP") {
                aAnswers.push({
                    skill: "ABAP Workbench",
                    level: oView.byId("abapWorkbench").getSelectedButton().getText()
                });
                aAnswers.push({
                    skill: "SmartForms/Adobe Forms",
                    level: oView.byId("formsSkill").getSelectedButton().getText()
                });
                aAnswers.push({
                    skill: "ABAP OOP",
                    level: oView.byId("oopAbapSkill").getSelectedButton().getText()
                });
                aAnswers.push({
                    skill: "Extensions/BADIs/User Exits",
                    level: oView.byId("extensionsSkill").getSelectedButton().getText()
                });
            }

            // Lógica final para redirigir al Learning Path
            MessageToast.show("Redirigiendo al Learning Path para: " + sEnvironment);
            console.log("Respuestas:", aAnswers);
        }
    });
});
