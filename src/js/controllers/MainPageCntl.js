import $ from "jquery";
import slick from 'slick-carousel';
import Inputmask from 'inputmask/dist/inputmask/inputmask.numeric.extensions'
import {Menu} from "../classes/Menu";
import {ScrollToPage} from "../classes/ScrollToPage";
import {Paginator} from "../classes/Paginator";
import {DeviceClassesSetter} from "../classes/DeviceClassesSetter";
import {TicketForm} from "../classes/TicketForm";
import {Parallax} from "../classes/Parallax";
import {Map} from "../classes/Map";
import {Winners} from "../classes/Winners";


export class MainPageCntl {
    constructor() {
        this.init();
    }

    init() {
        this.initDeviceClassesSetter();
        this.initMenu();
        this.initScrollToPage();
        this.initPaginator();
        this.initTicketForm();
        this.initSlider();
        this.initNavigationWinners();
        this.initInputMask();
        this.initParallax();
        this.initMap();
        this.initWinners();

        this.events();
    }

    events() {
        this.bindScrollLinks();
    }

    initDeviceClassesSetter() {
        this.deviceClassesSetter = new DeviceClassesSetter();
        this.deviceClassesSetter.init();
    }

    initMenu() {
        this.menu = new Menu({
            menu: $('.js-menu'),
            menuBtn: $('.js-menu-panel'),
            scrollOwner: $('.js-page-scroll-owner')
        });
        this.menu.init();
    }

    initScrollToPage() {
        this.scrollToPage = new ScrollToPage({
            pages: $('.js-page')
        });
        this.scrollToPage.init();
    }

    initPaginator() {
        this.paginator = new Paginator({
            scrollOwner: $('.js-page-scroll-owner')
        });
        this.paginator.init();
    }

    initTicketForm() {
        this.ticketForm = new TicketForm({
            form: $('.js-ticket-form')
        });
        this.ticketForm.init();
    }

    bindScrollLinks() {
        let self = this;
        if($('body').hasClass('ios')) {
            $(document).on('touchstart', '.menu .js-scroll-link', function( event ) {
                event.preventDefault();
                self.scrollToHref( $(this) );
            });
        }
        $(document).on('click', '.js-scroll-link', function( event ) {
            event.preventDefault();
            self.scrollToHref( $(this) );
        });
    }

    scrollToHref(link) {

        let scrollToElem = $(link.attr('href'));
        this.paginator.scrollTo(scrollToElem, link);
        this.menu.closeMenu();
    }

    initSlider() {
        $('.js-slider-container').slick({
            mobileFirst: true,
            arrows: false,
            slidesPerRow: 1,
            rows: 2,
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            responsive: [
                {
                    breakpoint: 993,
                    settings: "unslick"
                },
                {
                    breakpoint: 768,
                    settings: {
                        mobileFirst: true,
                        arrows: false,
                        slidesPerRow: 1,
                        rows: 2,
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: true,
                    }
                },
            ]
        });
    }

    initNavigationWinners() {
        let winners = $('.js-winners__list').find('.winners__item');
        winners.hover(function () {
            $(this).addClass('active').removeClass('in-active');
        },
        function () {
            $(this).addClass('in-active').removeClass('active');
        });
        /*if (winners.length >= 3) {
            $('.js-winners__navigation').show();
        }*/
    }

    initInputMask() {
        let imPhone = new Inputmask({
            mask: '+7(999)999-99-99',
            showMaskOnHover: false,
        });
        imPhone.mask($('.js-phone-mask'));
        let imCard = new Inputmask({
            mask: '999-999-9999',
            showMaskOnHover: false,
        });
        imCard.mask($('.js-card-mask'));
    }

    initParallax() {
        new Parallax(
            '.js-parallax-page-0',
            '.js-parallax-balloons'
        );
        new Parallax(
            '.js-parallax-page-0',
            '.js-parallax-balloon-29-year',
            50
        );
        new Parallax(
            '.js-parallax-page-2',
            '.js-parallax-balloons',
            50
        );
    }

    initMap() {
        let map = new Map('map');
        map.init();
    }

    initWinners() {
        let winners = new Winners();
        winners.init();
    }
}