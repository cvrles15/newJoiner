sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
], function (Controller, MessageToast, MessageBox) {
    "use strict";
    let history = {
		prevEnvironment: null,
	};

    return Controller.extend("newJoiner.controller.QuizView", {
        onInit: function () {
            this._wizard = this.byId("quizWizard");
			console.log("Master jeje");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oDataModel = this.getOwnerComponent().getModel("oDataModel");
		},

        gostep2: function () {
			let selectedIndex = this.getView().byId("environmentSelect").getSelectedIndex();
			switch (selectedIndex) {
				case 0:
					this.byId("step1").setNextStep(this.getView().byId("step2UI5"));
                    history.prevEnvironment = selectedIndex;
                    this.byId("buttontoolbar").setEnabled(true);
					break;
				case 1:
					this.byId("step1").setNextStep(this.getView().byId("step2ABAP"));
                    history.prevEnvironment = selectedIndex;
                    this.byId("buttontoolbar").setEnabled(true);
					break;
				case "Cash on Delivery":
				default:
					this.byId("step1").setNextStep(this.getView().byId("step2UI5"));
                    history.prevEnvironment = selectedIndex;
                    this.byId("buttontoolbar").setEnabled(true);
					break;
			}
		},

        setEnvironment: function () {
            var oResourceModel = this.getView().getModel("i18n");
            oResourceModel.getResourceBundle().then(function (oBundle) {
                var sMessage = oBundle.getText("btnText");
                this.setDiscardableProperty({
                    message: sMessage,
                    discardStep: this.byId("step1"),
                });
            }.bind(this)).catch(function (oError) {
                console.error("Error al cargar el ResourceBundle:", oError);
            });
        },        
        

		setDiscardableProperty: function (params) {
			if (this._wizard.getProgressStep() !== params.discardStep) {
				MessageBox.warning(params.message, {
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					onClose: function (oAction) {
						if (oAction === MessageBox.Action.YES) {
							this._wizard.discardProgress(params.discardStep);
                            this.byId("buttontoolbar").setEnabled(false);
						} else {
                            this.byId("environmentSelect").setSelectedIndex(history.prevEnvironment);
						}
					}.bind(this)
				});
			}
		},

        onWizardComplete: function () {
            let oView = this.getView();
            let oModel = this.getOwnerComponent().getModel("localData");
            let sEnvironment = oView.byId("environmentSelect").getSelectedButton().getText();
            let aAnswers = [];
            if (sEnvironment === "SAP BTP Fiori/UI5") {
                aAnswers.push({ skill: "JavaScript", level: oView.byId("jsSkill").getSelectedButton().getText() });
                aAnswers.push({ skill: "SAP HANA", level: oView.byId("hanaSkill").getSelectedButton().getText() });
                aAnswers.push({ skill: "CSS/HTML", level: oView.byId("cssHtmlSkill").getSelectedButton().getText() });
                aAnswers.push({ skill: "OData Services", level: oView.byId("odataSkill").getSelectedButton().getText() });
            } else if (sEnvironment === "SAP ABAP") {
                aAnswers.push({ skill: "ABAP Workbench", level: oView.byId("abapWorkbench").getSelectedButton().getText() });
                aAnswers.push({ skill: "SmartForms/Adobe Forms", level: oView.byId("formsSkill").getSelectedButton().getText() });
                aAnswers.push({ skill: "ABAP OOP", level: oView.byId("oopAbapSkill").getSelectedButton().getText() });
                aAnswers.push({ skill: "Extensions/BADIs/User Exits", level: oView.byId("extensionsSkill").getSelectedButton().getText() });
            }
            oModel.setProperty("/environment", sEnvironment);
            oModel.setProperty("/answers", aAnswers);
            MessageToast.show("Redirigiendo al Learning Path para: " + sEnvironment);
            this.oRouter.navTo("learningSection");
        }        
    });
});
