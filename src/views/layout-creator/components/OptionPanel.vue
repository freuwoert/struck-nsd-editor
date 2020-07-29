<template>
    <div class="option-panel">
        <div class="more" title="Menü     Strg + Umschalt + M" @click="toggleMoreMenu()">&#983900;</div>

        <div class="controls">
            <div class="control-icon-btn" @click="emit('undo')" title="Rückgängig machen     Strg + Z">&#984396;</div>
            <div class="control-icon-btn" @click="emit('redo')" title="Wiederherstellen     Strg + Y">&#984142;</div>
            <div class="control-icon-btn" @click="emit('delete')" :class="{'disabled': !selectedElements.length}" title="Auswahl löschen     Entf">&#985722;</div>
        </div>

        <div class="more-menu" :class="{'active': moreMenu}">
            <div class="option" @click="emit('new')">
                <div class="text">Neu</div>
                <div class="shortcut">Strg + N</div>
            </div>
            <div class="option" @click="emit('open')">
                <div class="text">Öffnen...</div>
                <div class="shortcut">Strg + O</div>
            </div>

            <div class="divider"></div>

            <div class="option" @click="emit('save')">
                <div class="text">Speichern...</div>
                <div class="shortcut">Strg + S</div>
            </div>
            <div class="option" @click="emit('save-as')">
                <div class="text">Speichern als...</div>
                <div class="shortcut">Strg + Umschalt + S</div>
            </div>

            <div class="divider"></div>

            <div class="option" @click="emit('export')">
                <div class="text">Exportieren...</div>
                <div class="shortcut">Strg + E</div>
            </div>
            <div class="option" @click="emit('settings')">
                <div class="text">Einstellungen</div>
                <div class="shortcut">Strg + Umschalt + E</div>
            </div>

            <div class="copyright"><span>&#983412;</span> Maurice Freuwört</div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import { EventBus } from '../../../assets/js/event-bus.js'

    export default {
        data() {
            return {
                moreMenu: false
            }
        },
        mounted() {
            EventBus.$on('menu', () => {
                this.toggleMoreMenu()
            })
        },
        computed: {
            ...mapGetters([
                'selectedElements'
            ]),
        },
        methods: {
            toggleMoreMenu() {
                this.moreMenu = !this.moreMenu
            },

            emit(event) {
                EventBus.$emit(event)
            }
        },
    }
</script>
<style lang="sass" scoped>
    .option-panel
        grid-area: option_panel
        background: var(--background)
        position: relative
        text-align: center

        .controls
            height: 40px
            user-select: none
            white-space: nowrap

            .control-icon-btn
                height: 30px
                width: 30px
                line-height: 30px
                border-radius: 30px
                margin: 5px 2px
                overflow: hidden
                color: var(--color)
                font-size: 20px
                font-family: 'Material Icons'
                vertical-align: top
                text-align: center
                cursor: pointer

                &:hover
                    background: var(--color-dimm)
                    color: var(--primary)

                &.disabled
                    background: transparent
                    color: #999
                    cursor: initial

        .more
            width: 32px
            height: 32px
            line-height: 32px
            text-align: center
            position: absolute
            left: 4px
            top: 4px
            color: var(--color)
            font-family: 'Material Icons'
            font-size: 20px
            user-select: none
            cursor: pointer
            border-radius: 40px

            &:hover
                color: var(--color-bright)
                background: var(--color-dimm)

        .more-menu
            position: fixed
            top: 73px
            left: 0px
            width: 300px
            text-align: left
            height: calc(100% - 73px)
            background: var(--background)
            z-index: 2
            margin-bottom: 10px
            padding: 15px 0
            transition: all 200ms cubic-bezier(0.65, 0.05, 0.36, 1)
            transform: translateX(-100%)

            &.active
                transform: translateX(0%)

            .copyright
                font-size: 12px
                line-height: 18px
                font-weight: 800
                letter-spacing: 1px
                text-transform: uppercase
                color: #00000030
                position: fixed
                bottom: 10px
                left: 10px
                z-index: 1000000
                pointer-events: none

                span
                    font-family: 'Material Icons'
                    width: 18px
                    height: 18px
                    text-align: center
                    line-height: 18px
                    font-size: 18px
                    vertical-align: top
                    margin-right: 5px

            .divider
                width: calc(100% - 30px)
                border-bottom: 1px solid var(--color-lighter)
                margin: 15px

            .option
                width: 100%
                user-select: none
                cursor: pointer
                color: var(--color-bright)

                .text
                    padding: 0 15px
                    height: 36px
                    line-height: 36px
                    font-size: 14px
                    font-weight: 600
                    color: inherit
                    vertical-align: top
                
                .shortcut
                    padding: 0 15px
                    height: 36px
                    line-height: 36px
                    font-size: 11px
                    font-weight: 700
                    color: inherit
                    vertical-align: top
                    float: right
                    color: var(--color-light)

                &:hover
                    color: var(--color-bright)
                    background: var(--color-dimm)
</style>