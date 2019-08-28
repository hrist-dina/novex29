import $ from "jquery";
import fancybox from "@fancyapps/fancybox";

export class Map {
    constructor(id = "map") {
        this.map = id;
    }

    init() {
        if (!this.initData()) {
            return;
        }
        this.initPanel();
        this.initMap();
    }

    placemarkTemplate(title, date) {
        return '<div class="placemark">' +
            `<div class="placemark__title">${title}</div>` +
            `<div class="placemark__date">${date}</div>` +
            '</div>';
    }

    initData() {
        let data = window.mapData;
        if (!data) {
            console.log('Ошибка! Не заданы данные для карты!');
            return false;
        }
        this.data = data;
        return true;

    }

    initPanel() {
        // Пример реализации боковой панели на основе наследования от collection.Item.
        // Боковая панель отображает информацию, которую мы ей передали.
        ymaps.modules.define('Panel', [
            'util.augment',
            'collection.Item'
        ], function (provide, augment, item) {
            // Создаем собственный класс.
            var Panel = function (options) {
                Panel.superclass.constructor.call(this, options);
            };

            // И наследуем его от collection.Item.
            augment(Panel, item, {
                onAddToMap: function (map) {
                    Panel.superclass.onAddToMap.call(this, map);
                    this.getParent().getChildElement(this).then(this._onGetChildElement, this);
                    // Добавим отступы на карту.
                    // Отступы могут учитываться при установке текущей видимой области карты,
                    // чтобы добиться наилучшего отображения данных на карте.
                    map.margin.addArea({
                        top: 0,
                        left: 0,
                        width: '250px',
                        height: '100%'
                    });
                },

                onRemoveFromMap: function (oldMap) {
                    if (this._$control) {
                        this._$control.remove();
                    }
                    Panel.superclass.onRemoveFromMap.call(this, oldMap);
                },

                _onGetChildElement: function (parentDomContainer) {
                    // Создаем HTML-элемент с текстом.
                    // По-умолчанию HTML-элемент скрыт.
                    this._$control = $('<div class="panel"><div class="panel-content"></div><div class="panel-close"></div></div>').appendTo(parentDomContainer);
                    this._$content = $('.panel-content');
                    // При клике по крестику будем скрывать панель.
                    $('.panel-close').on('click', this._onClose);
                },
                _onClose: function () {
                    $('.panel').css('display', 'none');
                },
                // Метод задания контента панели.
                setContent: function (text) {
                    if (text) {
                        // При задании контента будем показывать панель.
                        this._$control.css('display', 'flex');
                        this._$content.html(text);
                        $('.panel a').fancybox();
                    } else {
                        this._$control.css('display', 'none');
                        this._$content.html('');
                    }
                }
            });

            provide(Panel);
        });
    }

    initMap() {
        ymaps.ready(['Panel']).then(() => {

            try {
                // Инитим карту
                let map = new ymaps.Map(this.map, {
                    center: this.data.center ? this.data.center : [53.98620678930011, 87.15843014691794],
                    zoom: this.data.zoom ? this.data.zoom : 7,
                    controls: []
                });

                map.behaviors.disable('scrollZoom');
                map.controls.add('zoomControl');

                // Создадим и добавим панель на карту.
                var panel = new ymaps.Panel();
                map.controls.add(panel, {
                    float: 'left'
                });
                // Создадим коллекцию геообъектов.
                var collection = new ymaps.GeoObjectCollection(null, {
                    // Запретим появление балуна.
                    hasBalloon: false,
                });

                // Добавляем метки с городами
                this.data.cities.forEach((item) => {
                    var polygonLayout = ymaps.templateLayoutFactory.createClass(
                        this.placemarkTemplate(item.title, item.date)
                    );

                    var polygonPlacemark = new ymaps.Placemark(
                        item.coordinates, {
                            hintContent: 'HTML метка сложной формы',
                            balloonContent: item.balloonContent ? item.balloonContent : ''
                        }, {
                            iconLayout: polygonLayout,
                            // Описываем фигуру активной области "Полигон".
                            iconShape: {
                                type: 'Polygon',
                                coordinates: [
                                    [[-100, -30], [-100, 30], [100, 30], [100, -30]]
                                ]
                            }
                        }
                    );
                    collection.add(polygonPlacemark);
                    //map.geoObjects.add(polygonPlacemark);
                });

                // Добавим коллекцию на карту.
                map.geoObjects.add(collection);
                // Подпишемся на событие клика по коллекции.
                collection.events.add('click', function (e) {
                    // Получим ссылку на геообъект, по которому кликнул пользователь.
                    var target = e.get('target');
                    // Зададим контент боковой панели.
                    panel.setContent(target.properties.get('balloonContent'));
                    // Переместим центр карты по координатам метки с учётом заданных отступов.
                    map.panTo(target.geometry.getCoordinates(), {useMapMargin: true});
                });

            } catch (e) {
                console.error(e);
            }

        });
    }
}