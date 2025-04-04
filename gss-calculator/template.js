var form = document.querySelector("form");
var radioArr = form.querySelectorAll("input[type='radio']");
var volumeInput = form.querySelector("#VOLUME");
var packageFieldset = form.querySelector(
  ".form__fieldset[data-step='key_package']"
);
var result = document.querySelector(".result__total");
var errorMessage = document.querySelector(".form__error");

function makeCalculations(e) {
  var type = getSelectedValue("#TYPE", "id");
  var productPrice = 0;
  var spf = null;
  var segment = null;
  var packagePrice = 0;
  var decorPrice = 0;
  var secondaryPrice = 0;
  var addPriece = 0;
  var keyPackage = 0;
  var keyUkupor = 0;
  var keyLabel = 0;
  var keyPenal = 0;
  var volume = Math.round((volumeInput.value / 1000) * 100) / 100;
  var prepPrice = 100 * volume;
  var scheme = +getSelectedValue("#SCHEME", "id") ?? 0;
  if (scheme == 2) {
    keyPackage = +getSelectedValue("#KEY_PACKAGE") ?? 0;
    keyUkupor = +getSelectedValue("#KEY_UKUPOR") ?? 0;
    keyLabel = +getSelectedValue("#KEY_LABEL") ?? 0;
    keyPenal = +getSelectedValue("#KEY_PENAL") ?? 0;
  }
  radioArr.forEach((radio) => {
    if (radio.checked) {
      segment = radio.value;
    }
  });
  packagePrice = +getSelectedValue("#PACKAGE") ?? 0;
  decorPrice = +getSelectedValue("#DECOR") ?? 0;
  secondaryPrice = +getSelectedValue("#SECONDARY") ?? 0;
  addPriece = +getSelectedValue("#ADD") ?? 0;
  var tirage = +getSelectedValue("#TIRAGE");
  var totalPrice = 0;
  if (type > 0 && segment > 0 && volume > 0 && scheme > 0) {
    productPrice = getSelectedValue("#PRODUCT_" + type, "id") * segment;
    if (type == 3) {
      //Солнцезащитные средства
      spf = getSelectedValue("#SPF");
      productPrice = productPrice * spf;
    }
    if (productPrice > 0) {
      productPrice = productPrice * volume;
      productPrice += prepPrice;
      productPrice += packagePrice;
      productPrice += decorPrice;
      productPrice += secondaryPrice;
      productPrice += addPriece;
      productPrice += keyPackage;
      productPrice += keyUkupor;
      productPrice += keyLabel;
      productPrice += keyPenal;
      totalPrice = Math.round(productPrice * tirage * 100) / 100;
      errorMessage.classList.add("hidden");
    }
  }
  result.textContent = totalPrice;
}

radioArr.forEach((radio) => {
  radio.addEventListener("change", makeCalculations);
});
volumeInput.addEventListener("input", makeCalculations);

function getSelectedValue(selector, type = false) {
  var input = document.querySelector(`${selector}`);
  if (input) {
    var select = input.closest(".form__select");
    var selectedOption = select.querySelector(".form__option_selected");
    if (selectedOption) {
      if (selectedOption.dataset.price) {
        return selectedOption.dataset.price;
      } else if (selectedOption.dataset.mtp) {
        return selectedOption.dataset.mtp;
      } else if (type == "name") {
        return selectedOption.dataset.name;
      } else if (type == "id") {
        return selectedOption.dataset.id;
      }
    }
  }
  return false;
}

function switchProduct(e) {
  var form = e.target.closest("form");
  var formSelect = e.target.closest(".form__select");
  var productFieldset = form.querySelector(
    ".form__fieldset[data-step='product']"
  );
  if (e.target.dataset.id && formSelect.dataset.step == "type") {
    if (e.target.dataset.id > 0) {
      var selector = `PRODUCT_${e.target.dataset.id}`;
      var productInput = productFieldset.querySelector(`#${selector}`);
      if (productInput) {
        setProductsToDefault(productFieldset);
        setSpfToDefault(form);
        var productSelect = productInput.closest(".form__select");
        productSelect.classList.remove("hidden");
        productFieldset.classList.remove("hidden");
      }
    } else if (e.target.dataset.id == 0) {
      productFieldset.classList.add("hidden");
    }
  }
}

function setProductsToDefault(productFieldset) {
  var formSelectArr = productFieldset.querySelectorAll(".form__select");
  formSelectArr.forEach((select) => {
    if (select.classList.contains("hidden")) return;
    var hiddenInput = select.querySelector(".field-select_hidden");
    var selectInput = select.querySelector("input");
    var selectDefaultOption = select.querySelector(
      ".form__option[data-id='0']"
    );
    var activeOption = select.querySelector(".form__option_selected");
    if (selectDefaultOption && selectDefaultOption !== activeOption) {
      activeOption.classList.remove("form__option_selected");
      selectInput.value = selectInput.dataset.default ?? "";
      hiddenInput.value = hiddenInput.dataset.default ?? "";
      selectInput.setAttribute("placeholder", selectDefaultOption.dataset.name);
      selectDefaultOption.classList.add("form__option_selected");
    }
    select.classList.add("hidden");
  });
  productFieldset.classList.add("hidden");
}

function toggleSPF(e) {
  var spfFieldset = document.querySelector(".form__fieldset[data-step='spf']");
  if (e.target.dataset.type && e.target.dataset.type == "type") {
    if (e.target.dataset.name == "Солнцезащитные средства") {
      if (spfFieldset) {
        spfFieldset.classList.remove("hidden");
      }
    } else {
      spfFieldset.classList.add("hidden");
    }
  }
}

function setSpfToDefault(form) {
  var spfInput = form.querySelector("#SPF");
  var spfHiddenInput = form.querySelector("#SPF_HIDDEN");
  var spfSelect = spfInput.closest(".form__select");
  var spfOptions = spfSelect.querySelectorAll(".form__option");
  spfOptions.forEach((option) => {
    if (option.dataset.id == 0) {
      option.classList.add("form__option_selected");
    } else {
      option.classList.remove("form__option_selected");
    }
  });
  spfInput.value = spfInput.dataset.default ?? "";
  spfHiddenInput.value = spfHiddenInput.dataset.default ?? "";
  spfInput.setAttribute("placeholder", "Выбери из списка");
}

function checkPackage(e) {
  schemeContainer = form.querySelector(".form__select[data-step='scheme']");
  var keyPackageOption = schemeContainer.querySelector(
    ".form__option[data-package='key']"
  );
  var davalPackageOption = schemeContainer.querySelector(
    ".form__option[data-package='daval']"
  );
  var defaultPackageOption = schemeContainer.querySelector(
    ".form__option[data-id='0']"
  );
  if (
    e.target.dataset.type == "product" ||
    e.target.dataset.type == "package"
  ) {
    if (e.target.dataset.package && e.target.dataset.package == "y") {
      keyPackageOption.classList.add("hidden");
      davalPackageOption.click();
      packageFieldset.classList.add("hidden");
    } else {
      keyPackageOption.classList.remove("hidden");
      defaultPackageOption.click();
      packageFieldset.classList.add("hidden");
    }
  } else if (e.target.dataset.type == "scheme") {
    if (e.target.dataset.package && e.target.dataset.package == "key") {
      packageFieldset.classList.remove("hidden");
    } else {
      packageFieldset.classList.add("hidden");
    }
  }
}

function checkRequired() {
  var fieldSets = form.querySelectorAll(".form__fieldset");
  var isValid = true;
  fieldSets.forEach((fieldset) => {
    if (!fieldset.classList.contains("hidden")) {
      var selectFields = fieldset.querySelectorAll(".form__select");
      if (selectFields.length > 0) {
        selectFields.forEach((selectField) => {
          if (selectField && !selectField.classList.contains("hidden")) {
            var selectInput = selectField.querySelector(
              ".form__input.field-select"
            );
            var selectWrapper = selectInput.closest(".form__input-wrapper");
            if (selectInput && selectWrapper) {
              if (
                selectInput.value == "" ||
                selectInput.value == "Выбери из списка"
              ) {
                isValid = false;
                selectWrapper.classList.add("error");
              } else {
                selectWrapper.classList.remove("error");
              }
            }
          }
        });
      }
      var radioInputs = fieldset.querySelectorAll(
        "input[type='radio']:checked"
      );
      var radioContainer = fieldset.querySelector(".form__radio-wrapper");
      if (radioContainer) {
        if (radioInputs.length == 0) {
          isValid = false;
          radioContainer.classList.add("error");
        } else {
          radioContainer.classList.remove("error");
        }
      }
      var volumeWrapper = volumeInput.closest(".form__input-wrapper");
      if (volumeWrapper) {
        if (volumeInput.value <= 0) {
          isValid = false;
          volumeWrapper.classList.add("error");
        } else {
          volumeWrapper.classList.remove("error");
        }
      }
    }
  });
  return isValid;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (checkRequired()) {
    errorMessage.classList.add("hidden");
    makeCalculations();
  } else {
    errorMessage.classList.remove("hidden");
  }
});

const defaultConf = {
  formCN: "popup-form", //класс контейнера формы
  errorCN: "error", //класс ошибки формы
  inputContainerCN: "form__input-wrapper", //класс контейнера инпута
  inputCN: "form__input", //класс инпута
  textareaContainerCN: "form__textarea-wrapper", //класс контейнера текстареи
  textareaCN: "form__textarea", //класс текстареи
  textareaCounterCN: "form__textarea-counter-item", //класс счетчика текстареи
  clearBtnCN: "form__clear-btn", //класс кнопки очистки инпута
  clearBtnActiveCN: "form__clear-btn_active", //класс активной кнопки очистки инпута
  eyeBtnCN: "form__eye-btn", //класс кнопки показа/скрытия пароля
  eyeBtnActiveCN: "form__eye-btn_active", //класс активной кнопки показа/скрытия пароля
  labelCN: "form__label", //класс лэейбла инпута - если его надо двигать или еще чего
  labelActiveCN: "form__label_active", //класс активного лэйбла инпута
  selectCN: "field-select", //класс поля с выпадающим списком
  optionsBlockCN: "form__options-block", //класс блока со списком опций
  optionsBlockActiveCN: "form__options-block_active", //класс активного блока со списком опций
  isModal: false, //если true - значит форма в модальном окне и инициализируется показ/скрытие по клику
};

function initializeFormElements(config = {}) {
  let conf = Object.assign({}, defaultConf);
  if (config) {
    for (var key in config) {
      conf[key] = config[key];
    }
  }
  let inputClear = false;
  let selectInputArr = [];
  if (document.querySelector(`.${conf.formCN}`)) {
    selectInputArr = Array.from(
      document
        .querySelector(`.${conf.formCN}`)
        .querySelectorAll(`.${conf.selectCN}`)
    );
  }

  if (selectInputArr.length > 0) {
    function showOptions(e) {
      if (
        e.target.classList.contains(`${conf.selectCN}`) &&
        !e.target.classList.contains("closed")
      ) {
        var container = e.target.closest(".form__select");

        var options = container.querySelector(`.${conf.optionsBlockCN}`);
        var input = container.querySelector(`.${conf.selectCN}`);
        if (options) {
          options.classList.add(conf.optionsBlockActiveCN);
          container.classList.add("form__select_active");
          var form = e.target.closest("form");
          var selectFieldsArr = form?.querySelectorAll(".field-select_active");
          if (selectFieldsArr.length > 0) {
            selectFieldsArr.forEach((sField) => {
              if (sField !== input) {
                var sContainer = sField.closest(".form__select");
                var sOptions = sContainer.querySelector(".form__options-block");
                sContainer.classList.remove("form__select_active");
                sOptions.classList.remove("form__options-block_active");
                sField.classList.remove("field-select_active");
              }
            });
          }
          setTimeout(function () {
            input.classList.add("field-select_active");
          }, 100);
        }
      }
    }

    function hideOptions(e) {
      if (
        e.target.classList.contains("field-select_active") ||
        (!e.target.classList.contains(`${conf.selectCN}`) &&
          !e.target.classList.contains("field-select_active") &&
          !e.target.classList.contains("form__option"))
      ) {
        var containerArr = Array.from(
          document.querySelectorAll(".form__select_active")
        );
        containerArr.forEach((container) => {
          var options = container.querySelector(`.${conf.optionsBlockCN}`);
          var input = container.querySelector(`.${conf.selectCN}`);
          if (
            options &&
            options.classList.contains(conf.optionsBlockActiveCN)
          ) {
            options.classList.remove(conf.optionsBlockActiveCN);
            input.classList.remove("field-select_active");
            input.classList.add("closed");
            container.classList.remove("form__select_active");
            setTimeout(function () {
              input.classList.remove("closed");
            }, 100);
          }
        });
      }
    }

    function selectOption(e) {
      if (
        e.target.classList.contains("field-select_active") ||
        e.target.classList.contains("form__option")
      ) {
        var container = e.target.closest(".form__select");
        var options = container.querySelector(`.${conf.optionsBlockCN}`);
        var input = container.querySelector(`.${conf.selectCN}`);
        if (e.target.classList.contains("form__option") && e.target.dataset) {
          input.value = e.target.dataset.name;
          if (container.classList.contains("js-set-id")) {
            //Если нужно отправить не текст, а ID в качестве значения
            var hiddenInput = container.querySelector(".field-select_hidden");
            hiddenInput.value =
              e.target.dataset.id > 0 ? e.target.dataset.id : "";
          }
          input.setAttribute("placeholder", e.target.dataset.name);
          var optionsArr = Array.from(
            options.querySelectorAll(".form__option")
          );
          if (optionsArr.length > 0) {
            optionsArr.forEach((opt) => {
              opt.classList.remove("form__option_selected");
            });
          }
          e.target.classList.add("form__option_selected");
          blurInput(input);
          options.classList.remove(conf.optionsBlockActiveCN);
          container.classList.remove("form__select_active");
          input.classList.remove("field-select_active");
          switchProduct(e);
          toggleSPF(e);
          checkPackage(e);
          makeCalculations();
        } else {
          options.classList.remove(conf.optionsBlockActiveCN);
          container.classList.remove("form__select_active");
          input.classList.remove("field-select_active");
          input.classList.add("closed");
          setTimeout(function () {
            input.classList.remove("closed");
          }, 100);
        }
      }
    }
    document.addEventListener("click", hideOptions);
    document.addEventListener("click", selectOption);
    document.addEventListener("click", showOptions);
  }
  function focusInput(e) {
    clearError(e);
    var data = getInputData(e.target);
    if (data.caption) {
      if (!e.target.classList.contains(`${conf.selectCN}`))
        activateCaption(data.caption);
      if (data.clean) {
        if (data.value) {
          showCleanBtn(data.clean, data.icon);
        } else {
          hideCleanBtn(data.clean, data.icon);
        }
      }
    }
  }

  function changeInput(e) {
    clearError(e);
    var data = getInputData(e.target);
    if (data.clean) {
      if (data.value) {
        showCleanBtn(data.clean, data.icon);
      } else {
        hideCleanBtn(data.clean, data.icon);
      }
    }
  }

  function blurInput(e) {
    var input = e.target;
    if (e.classList) {
      input = e;
    }
    if (!inputClear) {
      var data = getInputData(input);
      if (data.clean) {
        hideCleanBtn(data.clean, data.icon);
      }
      if (data.value == "") {
        if (data.caption) {
          deactivateCaption(data.caption);
        }
      } else {
        activateCaption(data.caption);
      }
    }
  }

  function clearInput(e) {
    var container = e.target?.closest(`.${conf.inputContainerCN}`);
    var input = container?.querySelector("input");
    var icon = false;
    if (conf.iconCN) {
      icon = container?.querySelector(`.${conf.iconCN}`);
    }
    if (input) {
      input.value = "";
      hideCleanBtn(e.target, icon);
      input.focus();
    }
    inputClear = false;
  }

  function activateCaption(caption) {
    caption?.classList.add(conf.labelActiveCN);
  }

  function deactivateCaption(caption) {
    caption?.classList.remove(conf.labelActiveCN);
  }

  function showCleanBtn(button, icon = false) {
    button?.classList.add(conf.clearBtnActiveCN);
    if (icon) {
      icon.classList.add(conf.iconDisabledCN);
    }
  }

  function hideCleanBtn(button, icon = false) {
    button?.classList.remove(conf.clearBtnActiveCN);
    if (icon) {
      icon.classList.remove(conf.iconDisabledCN);
    }
  }

  function getInputData(input) {
    var data = {
      container: false,
      caption: false,
      clean: false,
      value: false,
      icon: false,
    };
    data.container = input.closest(`.${conf.inputContainerCN}`);
    data.caption = data.container?.querySelector(`.${conf.labelCN}`);
    data.clean = data.container?.querySelector(`.${conf.clearBtnCN}`);
    if (conf.iconCN)
      data.icon = data.container?.querySelector(`.${conf.iconCN}`);
    data.value = input.value;
    return data;
  }

  function clearError(e) {
    if (e.target) {
      var input = e.target;
    } else {
      var input = e;
    }
    var container = input.closest(`.${conf.errorCN}`);
    if (container) {
      container.classList.remove(conf.errorCN);
    }
  }
  function onLoadCheck(inputsArr) {
    inputsArr.forEach((input) => {
      data = getInputData(input);
      if (data.caption) {
        if (data.value) {
          activateCaption(data.caption);
          if (data.clean) showCleanBtn(data.clean, data.icon);
        } else {
          deactivateCaption(data.caption);
          if (data.clean) hideCleanBtn(data.clean, data.icon);
        }
      }
    });
  }
  /* Если на странице есть форма */
  let formContainer = false;
  if (conf.formCN) {
    formContainer = document.querySelector(`.${conf.formCN}`);
  }
  if (formContainer) {
    function clearErrors() {
      if (formContainerForm) {
        var errors = Array.from(
          formContainerForm?.querySelectorAll(`.${conf.errorCN}`)
        );
        errors.forEach((error) => error.classList.remove(conf.errorCN));
      }
    }

    const formContainerForm = formContainer?.querySelector("form");
    if (formContainerForm) {
      //formContainerForm.classList.add('form-popup__body');
      const inputsArr = Array.from(
        formContainerForm.querySelectorAll(`.${conf.inputCN}`)
      );
      const clearBtns = Array.from(
        formContainerForm.querySelectorAll(`.${conf.clearBtnCN}`)
      );

      const textareaContainersArr = Array.from(
        formContainerForm.querySelectorAll(`.${conf.textareaContainerCN}`)
      );

      inputsArr.forEach((input) => {
        input.addEventListener("focus", focusInput);
        input.addEventListener("input", changeInput);
        input.addEventListener("blur", blurInput);
        //input.addEventListener("change", blurInput);
      });

      clearBtns?.forEach((button) =>
        button.addEventListener("click", clearInput)
      );
      clearBtns?.forEach((button) =>
        button.addEventListener("mousedown", function (e) {
          e.preventDefault();
        })
      );

      textareaContainersArr.forEach((textareaContainer) => {
        const currTextarea = textareaContainer.querySelector(
          `.${conf.textareaCN}`
        );
        const currTextareaCounter = textareaContainer.querySelector(
          `.${conf.textareaCounterCN}`
        );

        currTextarea.addEventListener("input", (e) => {
          currTextareaCounter.innerHTML = e.target.value.length;
        });
      });
      onLoadCheck(inputsArr);
    }
  } else {
    if (selectInputArr.length > 0) {
      onLoadCheck(selectInputArr);
      selectInputArr.forEach((input) => {
        input.addEventListener("focus", focusInput);
        input.addEventListener("input", changeInput);
        input.addEventListener("blur", blurInput);
        //input.addEventListener("change", blurInput);
      });
    }
  }
}
