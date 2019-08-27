import $ from "jquery";

export class TicketForm {
    constructor(options) {
        this.form = options.form;

        this.requireFiled = 'validator-require';
        this.typeFiled = 'validator-type';

        this.massages = {
            required: 'Поле обязательное для заполнения!',
            email: 'Некорректный Email адрес!',
            phone: 'Некорректный телефон!'
        };

    }

    init() {
        this.events();
    }

    events() {
        this.bindTextInputFocus();
        this.bindTextInputBlur();
        this.bindInputType();
        this.bindCheckAgreement();
        this.bindCloseFormSuccessMessage();
        this.submit();
    }

    submit() {
        let self = this;
        this.form.on('submit', function(event){
            event.preventDefault();
            if (self.validate()) {
                self.submitEvent();
            }
        });
    }

    submitEvent () {
        this.clearErrors($('.js-ticket-form'));
        let self = this;
        $.ajax({
            type: "POST",
            url: "/",
            data: $(".js-ticket-form").serialize(),
            dataType: "json",
            success: function (data) {
                if (data.status === 'success') {
                    self.showSuccessMessage();
                }
                if (data.status === 'error') {
                    console.error('error | ' + data.message);
                }
                if (data.status === 'warning') {
                    console.error('warning | ' + data.message);
                    self.setErrors(data.errors, $('.js-ticket-form'));
                }
            },
            error: function (data) {

                // TODO:: Удалить, после переноса на бэкенд
                self.showSuccessMessage();
                console.error('error ajax');
            }
        });
    }

    get fields() {
        return this.form.find('.ticket-form__elem').find('input');
    }

    validate() {
        let errors = {};
        this.fields.map((key, item) => {
            let value = $(item).val();
            let id  = $(item).attr('id');

            if ($(item).data(this.requireFiled) === true && this.constructor.checkEmpty(value)) {
                errors[id] = this.massages.required;
            }

            if (!this.constructor.checkEmpty(value)) {
                switch ($(item).data(this.typeFiled)) {
                    case 'email':
                    if (this.constructor.checkEmail(value)) {
                            errors[id] = this.massages.email;
                        }
                        break;
                    case 'phone':
                        if (this.constructor.checkPhone(value)) {
                            errors[id] = this.massages.phone;
                        }
                        break;
                    default:
                        break;
                }
            }

        });

        this.clearErrors();
        this.setErrors(errors);

        return $.isEmptyObject(errors);
    }

    static checkEmpty(string) {
        return string === '';
    }

    static checkEmail(string) {
        return !!string.search(/^[-._a-z0-9]+@+[a-z0-9-]+\.[a-z]{2,6}$/i);
    }

    static checkPhone(string) {
        return !!string.search(/^\+7\(([0-9]{3})\)([0-9]{3})-([0-9]{2})-([0-9]{2})$/i);
    }

    bindTextInputFocus() {
        this.fields.on('focus', function() {
            $(this).closest('.ticket-form__elem').addClass('active');
        });
    }

    bindTextInputBlur() {
        this.fields.on('blur', function() {
            let inputElem = $(this);
            let inputElemParent = inputElem.closest('.ticket-form__elem');
            let getVal = inputElem.val();

            inputElemParent.removeClass('active');
            inputElemParent.addClass('success');

            if (!getVal.length) {
                inputElemParent.removeClass('success');
            }
        });
    }

    bindCheckAgreement() {
        let submitBtn = this.form.find('.js-ticket-form__submit-button');
        this.form.find('.ticket-form__verification-check').find('input').on('change', function() {
            $(this).prop('checked') ? submitBtn.prop('disabled', false) : submitBtn.prop('disabled', true);
        });
    }

    bindCloseFormSuccessMessage() {
        let self = this;
        $('.js-close-form-success-message').on('click', function () {
            $('.js-ticket-form-success').hide();
            self.resetTextInputs();
        });
    }

    bindInputType() {
        let formElem = this.form.find('.ticket-form__elem');
        formElem.find('input').on('keyup', function() {
            $(this).closest('.ticket-form__elem').removeClass('error');
            $(this).siblings('.ticket-form__error-text').remove();
        });
    }

    showSuccessMessage() {
        $('.js-ticket-form-success').show();
    }

    resetTextInputs() {
        this.form.find('input[type="text"]').val('').trigger('blur');
    }

    clearErrors(form) {
        form = form || this.form;
        form.find('.ticket-form__elem').removeClass('error');
        form.find('.ticket-form__elem').find('.ticket-form__error-text').remove();
    }

    setErrors( errors, form) {
        form = form || this.form;
        for ( let key in errors ) {
            form.find('#' + key).closest('.ticket-form__elem').addClass('error');
            form.find('#' + key).after('<p class="ticket-form__error-text">' + errors[key] + '</p>');
        }
    }
}