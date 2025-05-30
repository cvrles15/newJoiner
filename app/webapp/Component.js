sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/Device", "newjoiner/model/models", "sap/ui/model/json/JSONModel"], function (UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("newjoiner.Component", {
		metadata: {
			manifest: "json"
		},
		init: function () {
			let oRouter;			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments); // create the views based on the url/hash
			oRouter  = this.getRouter();
            oRouter.attachBeforeRouteMatched(this.onBeforeRouteMatched, this);
			oRouter.initialize();
                // set the device model
			this.setModel(models.createDeviceModel(), "device");
			let oLocalModel = new JSONModel();
			this.setModel(oLocalModel, "localData");
		},
		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @returns {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this.contentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (document.body.classList.contains("sapUiSizeCozy") || document.body.classList.contains("sapUiSizeCompact")) {
					this.contentDensityClass = "";
				} else if (!Device.support.touch) {
					// apply "compact" mode if touch is not supported
					this.contentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this.contentDensityClass = "sapUiSizeCozy";
				}
			}
			return this.contentDensityClass;
		},

		onBeforeRouteMatched: function (oEvent) {
			console.log("HOLA!!!!!!!");
		}
	});
});
