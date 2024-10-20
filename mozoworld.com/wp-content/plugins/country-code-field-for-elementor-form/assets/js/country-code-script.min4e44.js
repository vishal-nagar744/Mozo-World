class CCFEF extends elementorModules.frontend.handlers.Base{getDefaultSettings(){return{selectors:{inputTelTextArea:"textarea.ccfef_country_code_data_js",intlInputSpan:".ccfef-editor-intl-input",submitButton:"div.elementor-field-type-submit button"}}}getDefaultElements(){const selectors=this.getSettings("selectors");return{$textArea:this.$element.find(selectors.inputTelTextArea),$intlSpanElement:this.$element.find(selectors.intlInputSpan),$submitButton:this.$element.find(selectors.submitButton)}}bindEvents(){this.telId=new Array,this.includeCountries={},this.excludeCountries={},this.defaultCountry={},this.iti={},this.getIntlUserData(),this.appendCountryCodeHandler(),this.addCountryCodeInputHandler(),this.removeInputTelSpanEle(),this.intlInputValidation()}appendCountryCodeHandler(){this.telId.forEach(data=>{this.addCountryCodeIconHandler(data.formId,data.fieldId,data.customId)})}addCountryCodeIconHandler(formId,widgetId,inputId){const utilsPath=CCFEFCustomData.pluginDir+"assets/intl-tel-input/js/utils.min.js",telFIeld=jQuery(`.elementor-widget.elementor-widget-form[data-id="${formId}"] .elementor-field-type-tel.elementor-field-group input[type="tel"]#${inputId}`)[0];if(void 0!==telFIeld){let includeCountries=[],excludeCountries=[],defaultCountry="in";const defaultCoutiresArr=["in","us","gb","ru","fr","de","br","cn","jp","it"],uniqueId=`${formId}${widgetId}`;if(this.includeCountries.hasOwnProperty(uniqueId)&&this.includeCountries[uniqueId].length>0&&(defaultCountry=this.includeCountries[uniqueId][0],includeCountries=this.includeCountries[uniqueId].map(value=>value)),this.excludeCountries.hasOwnProperty(uniqueId)&&this.excludeCountries[uniqueId].length>0){let uniqueValue;defaultCountry=defaultCoutiresArr.filter(value=>!this.excludeCountries[uniqueId].includes(value))[0],excludeCountries=this.excludeCountries[uniqueId].map(value=>value)}this.defaultCountry[uniqueId]&&""!==this.defaultCountry[uniqueId]&&(defaultCountry=this.defaultCountry[uniqueId]);const iti=window.intlTelInput(telFIeld,{initialCountry:defaultCountry,utilsScript:utilsPath,formatOnDisplay:!1,formatAsYouType:!1,autoFormat:!1,containerClass:"cfefp-intl-container",useFullscreenPopup:!1,onlyCountries:includeCountries,excludeCountries:excludeCountries,customPlaceholder:function(selectedCountryPlaceholder,selectedCountryData){let placeHolder=selectedCountryPlaceholder;"in"===selectedCountryData.iso2&&(placeHolder=selectedCountryPlaceholder.replace(/^0+/,""));const placeholderText=`+${selectedCountryData.dialCode} ${placeHolder}`;return placeholderText.replace(/\s/g,"")}});telFIeld.removeAttribute("pattern"),this.iti[formId+widgetId]=iti}}addCountryCodeInputHandler(){const itiArr=this.iti;Object.keys(itiArr).forEach(key=>{const iti=itiArr[key],inputElement=iti.a;let previousCountryData=iti.getSelectedCountryData(),previousCode=`+${previousCountryData.dialCode}`,keyUpEvent=!1;const resetKeyUpEventStatus=()=>{keyUpEvent=!1},handleCountryChange=e=>{const currentCountryData=iti.getSelectedCountryData(),currentCode=`+${currentCountryData.dialCode}`;if("keydown"===e.type||"input"===e.type)keyUpEvent=!0,clearTimeout(resetKeyUpEventStatus),setTimeout(resetKeyUpEventStatus,400),previousCountryData.dialCode!==currentCountryData.dialCode?previousCountryData=currentCountryData:previousCountryData.dialCode===currentCountryData.dialCode&&previousCountryData.iso2!==currentCountryData.iso2&&iti.setCountry(previousCountryData.iso2);else if("countrychange"===e.type){if(keyUpEvent)return;previousCountryData=currentCountryData}this.updateCountryCodeHandler(e.currentTarget,currentCode,previousCode),previousCode=currentCode};inputElement.addEventListener("keydown",handleCountryChange),inputElement.addEventListener("input",handleCountryChange),inputElement.addEventListener("countrychange",handleCountryChange)})}updateCountryCodeHandler(element,currentCode,previousCode){let value=element.value;currentCode&&"+undefined"===currentCode||["","+"].includes(value)||(currentCode!==previousCode&&(value=value.replace(new RegExp(`^\\${previousCode}`),"")),value.startsWith(currentCode)||(value=value.replace(/\+/g,""),element.value=currentCode+value))}removeInputTelSpanEle(){this.$element.find("span.ccfef-editor-intl-input").remove()}getIntlUserData(){const intelInputElement=this.elements.$intlSpanElement,previousIds=[];intelInputElement.each((_,ele)=>{const element=jQuery(ele),includeCountries=element.data("include-countries"),excludeCountries=element.data("exclude-countries"),defaultCountry=element.data("defaultCountry"),inputId=element.data("id"),fieldId=element.data("field-id"),formId=element.closest(".elementor-element.elementor-widget-form").data("id"),currentId=`${formId}${fieldId}`;if(""!==includeCountries){const splitIncludeCountries=includeCountries.split(",");this.includeCountries[currentId]=splitIncludeCountries}if(""!==excludeCountries){const splitExcludeCountries=excludeCountries.split(",");this.excludeCountries[currentId]=splitExcludeCountries}""!==defaultCountry&&(this.defaultCountry[currentId]=defaultCountry),previousIds.includes(currentId)||(this.telId.push({formId:formId,fieldId:fieldId,customId:inputId}),previousIds.push(currentId))})}intlInputValidation(){this.elements.$submitButton.on("click",e=>{const itiArr=this.iti;Object.keys(itiArr).length>0&&Object.keys(itiArr).forEach(data=>{const iti=itiArr[data],inputTelElement=iti.a,parentWrp=inputTelElement.closest(".elementor-field-group"),telContainer=parentWrp.querySelector(".cfefp-intl-container");telContainer&&inputTelElement.offsetHeight&&telContainer.style.setProperty("--cfefp-intl-tel-button-height",`${inputTelElement.offsetHeight}px`);const errorContainer=jQuery(inputTelElement).parent();errorContainer.find("span.elementor-message").remove();const errorMap=["The phone number you entered is not valid. Please check the format and try again.","The country code you entered is not recognized. Please ensure it is correct and try again.","The phone number you entered is too short. Please enter a complete phone number, including the country code.","The phone number you entered is too long. Please ensure it is in the correct format and try again.","The phone number you entered is not valid. Please check the format and try again."];let errorMsgHtml='<span class="elementor-message elementor-message-danger elementor-help-inline elementor-form-help-inline" role="alert">';if(""!==inputTelElement.value)if(iti.isValidNumber())jQuery(inputTelElement).closest(".cfefp-intl-container").removeClass("elementor-error");else{const errorType=iti.getValidationError();void 0!==errorType&&errorMap[errorType]&&(errorMsgHtml+=errorMap[errorType]+"</span>",jQuery(inputTelElement).closest(".cfefp-intl-container").addClass("elementor-error"),jQuery(inputTelElement).after(errorMsgHtml),e.preventDefault())}})})}}jQuery(window).on("elementor/frontend/init",()=>{const addHandler=$element=>{elementorFrontend.elementsHandler.addHandler(CCFEF,{$element:$element})};elementorFrontend.hooks.addAction("frontend/element_ready/form.default",addHandler)});