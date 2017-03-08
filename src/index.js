"use strict";
import Custom from "./core/custom.js";
import Confirm from "./core/confirm.js";
import Alert from "./core/alert.js";
import Base from "./base.js";

export default class Dialog {
    constructor( props ) {
        new Base( props );
        return this;
    }

    customs( props ) {
        return new Custom( props );
    }

    confirm( props ) {
        return new Confirm( props );
    }

    alert( props ) {
        return new Alert( props ) ;
    }
}
