sap.ui.define(
    ["sap/m/Dialog", "sap/m/Button", "sap/m/List", "sap/m/StandardListItem", "sap/m/MessageToast", "sap/m/Text", "sap/m/VBox"],
    function (Dialog, Button, List, StandardListItem, MessageToast, Text, VBox) {
      "use strict";
  
      return {
        _isFunctionExecuted: true,
        getAllCookies: async function () {
          // if (window.cookieStore) {
          //   return await window.cookieStore.getAll();
          // }
          const cookies = [];
          const allCookies = document.cookie.split(";");
          allCookies.forEach((cookie) => {
            const [name, value] = cookie.trim().split("=");
            cookies.push({ name, value });
          });
          return cookies;
        },
  
        checkCookies: async function () {
          if (this._isFunctionExecuted) {
            this._isFunctionExecuted = false;
            const allCookies = await this.getAllCookies();
            const problematicCookies = this.findNonCompliantCookies(allCookies);
            if (problematicCookies.length > 0) {
              this.showCookieDialog(problematicCookies);
            }
          }
        },
  
        findNonCompliantCookies: function (cookies) {
          const problematicCookies = [];
          cookies.forEach((cookie) => {
            if (!this.isCompliant(cookie.value)) {
              problematicCookies.push({
                name: cookie.name,
                value: cookie.value,
                reason: this.getComplianceIssue(cookie.value),
              });
            }
          });
          return problematicCookies;
        },
  
        isCompliant: function (value) {
          if (!value) return false;
  
          const asciiRegex = /^[\x20-\x7E]+$/;
          const invalidCharsRegex = /[\s,;]/;
  
          if (typeof value === "string" && value.includes('"cmapi_cookie_privacy"')) {
            try {
              JSON.parse(value);
              return true;
            } catch (e) {
              return false;
            }
          }
  
          return asciiRegex.test(value) && !invalidCharsRegex.test(value);
        },
  
        getComplianceIssue: function (value) {
          if (!value) return "Empty value";
          if (!/^[\x20-\x7E]+$/.test(value)) return "Contains non-ASCII characters";
          if (/[\s,;]/.test(value)) return "Contains invalid characters (spaces, commas, or semicolons)";
          return "General compliance issue";
        },
  
        showCookieDialog: function (problematicCookies) {
          const list = new List({
            items: problematicCookies.map(
              (cookie) =>
                new StandardListItem({
                  title: cookie.name,
                  description: `Issue: ${cookie.reason}`,
                  info: cookie.value.substring(0, 30) + (cookie.value.length > 30 ? "..." : ""),
                })
            ),
          });
  
          const dialog = new Dialog({
            title: "Non-Compliant Cookies Detected",
            content: [
              new VBox({
                items: [
                  new Text({
                    text: "The following cookies do not comply with current security standards and need to be cleared:",
                  }).addStyleClass("sapUiSmallMarginBottom"),
                  list,
                ],
              }),
            ],
            buttons: [
              new Button({
                text: "Clear Cookies and Reload",
                type: "Emphasized",
                press: function () {
                  this.clearCookiesAndReload(problematicCookies);
                  dialog.close();
                }.bind(this),
              }),
              new Button({
                text: "Cancel",
                press: function () {
                  dialog.close();
                },
              }),
            ],
          });
  
          dialog.open();
        },
  
        clearCookiesAndReload: async function (cookiesToClear) {
          for (const cookie of cookiesToClear) {
            await this.deleteCookie(cookie.name);
          }
  
          MessageToast.show("Cookies cleared. Reloading application...", {
            duration: 3000,
            onClose: function () {
              window.location.reload();
            },
          });
        },
  
        deleteCookie: async function (name) {
          if (window.cookieStore) {
            await cookieStore.delete(name);
          } else {
            const domains = [window.location.hostname, "." + window.location.hostname, window.location.hostname.split(".").slice(1).join(".")];
  
            const paths = ["/", "/path"];
  
            domains.forEach((domain) => {
              paths.forEach((path) => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
              });
            });
          }
        },
  
        logCookieDetails: function (cookie) {
          console.group("Cookie Details");
          console.log("Name:", cookie.name);
          console.log("Value:", cookie.value);
          console.log("Domain:", cookie.domain);
          console.log("Path:", cookie.path);
          console.log("Expires:", cookie.expires);
          console.log("Secure:", cookie.secure);
          console.log("HttpOnly:", cookie.httpOnly);
          console.groupEnd();
        },
      };
    }
  );
  