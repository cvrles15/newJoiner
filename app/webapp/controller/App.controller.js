sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
	"use strict";

	return Controller.extend("newjoiner.controller.App", {
		onInit: function () {
			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});
