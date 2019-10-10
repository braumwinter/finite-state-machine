class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        try {
            if (!config.initial) {
                throw new AssertionError('expected [Function] to throw Error');
            }

            // текущее состояние
            this.state = config.initial;

            // история изменений
            this.history = [];
            this.history.push(config.initial);

            // возможные состояния
            this.arr_states = [];

            // массив отмен
            this.arr_cancel = [];

            // возможна ли возвращение текущего состояния перед отменой
            this.is_redo = false;

            for (let key in config.states) {
                this.arr_states.push(key);
            }

        } catch (err) {
            return ("AssertionError: " + e.message);
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        try {
            // проверка является ли состояние допустимым
            let is_state = false;

            for (let iter_arr_states = 0; iter_arr_states < this.arr_states.length; iter_arr_states++) {
                if (state === this.arr_states[iter_arr_states]) {
                    is_state = true;
                    break;
                }
            }

            // не является - ошибка
            if (!is_state) {
                throw new AssertionError('expected [Function] to throw Error');
            }

            // является - меняем состояние. возврат отмены не возможен
            this.state = state;
            this.history.push(state);
            this.is_redo = false;

        } catch (err) {
            return ("AssertionError: " + e.message);
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        try {
            switch (this.state) {

                case 'normal': {
                    if (event === 'study') {
                        this.changeState('busy');
                    } else {
                        throw new AssertionError('expected [Function] to throw Error');
                    }
                    break;
                }

                case 'busy': {
                    if (event === 'get_tired') {
                        this.changeState('sleeping');
                    } else if (event === 'get_hungry') {
                        this.changeState('hungry');
                    } else {
                        throw new AssertionError('expected [Function] to throw Error');
                    }
                    break;
                }

                case 'hungry': {
                    if (event === 'eat') {
                        this.changeState('normal');
                    } else {
                        throw new AssertionError('expected [Function] to throw Error');
                    }
                    break;
                }

                case 'sleeping': {
                    if (event === 'get_hungry') {
                        this.changeState('hungry');
                    } else if (event === 'get_up') {
                        this.changeState('normal');
                    } else {
                        throw new AssertionError('expected [Function] to throw Error');
                    }
                    break;
                }

                default: {
                    throw new AssertionError('expected [Function] to throw Error');
                }
            }
        } catch (err) {
            return ("AssertionError: " + e.message);
        }

        // при изменении состояния, возврат из отмены не возможен
        this.is_redo = false;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState('normal');
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (!event) {
            return ['normal', 'busy', 'hungry', 'sleeping'];
        } else {
            switch (event) {

                case 'study': {
                    return ['normal'];
                }

                case 'get_tired': {
                    return ['busy'];
                }

                case 'get_hungry': {
                    return ['busy', 'sleeping'];
                }

                case 'eat': {
                    return ['hungry'];
                }

                case 'get_up': {
                    return ['sleeping'];
                }

                default: {
                    return [];
                }
            }
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        // для отмены требуется как миминум две записи в истории
        // текущее состояние и откат
        // возврат из отмены становится возможным
        if (this.history.length < 2) {
            return false;
        } else {
            this.arr_cancel.push(this.state);
            this.state = this.history[this.history.length - 2];
            this.history.pop();
            this.is_redo = true;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        // чтобы вернуть из отмены, требуется хотя бы отдна запись в стеке
        if (this.arr_cancel.length === 0) {
            return false;
        } else if (this.is_redo) {
            this.state = this.arr_cancel[this.arr_cancel.length - 1];
            this.arr_cancel.pop();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        // извлекаем, пока не пусто
        while (this.history.length) {
            this.history.pop();
        }
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/