sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("newjoiner.controller.LearningPath", {
        onInit: function () {
            this.oDataModel = this.getOwnerComponent().getModel("localData");
            
            let sEnvironment = this.oDataModel.getProperty("/environment");
            let aAnswers = this.oDataModel.getProperty("/answers");
        
            let aRecommendedCourses = [];
        
            if (sEnvironment.includes("UI5")) {
                aAnswers.forEach(answer => {
                    if (answer.level === "None" || answer.level === "Basic") {
                        aRecommendedCourses.push({
                            title: `Curso Avanzado de ${answer.skill}`,
                            description: `Mejora tu conocimiento en ${answer.skill} con este curso.`,
                            icon: "sap-icon://education"
                        });
                    }
                });
                this.oDataModel.setProperty("/btpCourses", aRecommendedCourses);
            } else {
                aAnswers.forEach(answer => {
                    if (answer.level === "None" || answer.level === "Basic") {
                        aRecommendedCourses.push({
                            title: `Curso Avanzado de ${answer.skill}`,
                            description: `Aprende más sobre ${answer.skill}.`,
                            icon: "sap-icon://education"
                        });
                    }
                });
                this.oDataModel.setProperty("/abapCourses", aRecommendedCourses);
                this._getLearningPath();
            }
        },
        
        _getLearningPath: function () {
            let oModel = this.getView().getModel("oDataModel");
            let sInputName = this.getView().getModel().getProperty("/sInputName");
                oModel.read("/getReceivedRequests", {
                    urlParameters: {
                        userName: "Pepito",
                        type: sInputName
                    },
                    success: (oData) => {
                        if (oData && oData.results && oData.results.length > 0) {
                            let receivedRequests = oData.results;
                            let pendingUsers = this.getView().getModel().getProperty("/pendingUsers") || [];
                            receivedRequests.forEach(function (request) {
                                if (sInputName === 'Origin') {
                                    request.origin = request.direction;
                                    request.destination = "Boehringer Ingelheim, Carrer de Bernat Metge, Sant Cugat del Vallès, Vallés Occidental, Barcelona, 08195, España";
                                    delete request.direction;
                                } else {
                                    request.destination = request.direction;
                                    request.origin = "Boehringer Ingelheim, Carrer de Bernat Metge, Sant Cugat del Vallès, Vallés Occidental, Barcelona, 08195, España";
                                    delete request.direction;
                                }
                                request.type = "received";
    
                                let isUserExist = pendingUsers.some(function(user) {
                                    return user.name === request.name;
                                });
                        
                                if (!isUserExist) {
                                    pendingUsers.push(request);
                                };                  
                            });
                            this.getView().getModel().setProperty("/pendingUsers", pendingUsers);
                            this.getView().getModel().refresh(true);
                        }
                    },
                    error: (oError) => {
                        console.error(oError);
                    }
                });
        },

        onCompleteLearning: function () {
            let oModel = this.getView().getModel("oDataModel");
            oModel.setProperty("/progress", 100);
            MessageToast.show("¡Has completado tu aprendizaje!");
        }
    });
});
