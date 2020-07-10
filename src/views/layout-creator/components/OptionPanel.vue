<template>
    <div class="option-panel">
        <div class="more" title="Menü     STRG + UMSCHALT + M" @click="toggleMoreMenu()">&#983900;</div>

        <div class="controls">
            <div class="control-icon-btn" title="Rückgängig machen     STRG + Z">&#984396;</div>
            <div class="control-icon-btn" title="Wiederherstellen     STRG + Y">&#984142;</div>
            <div class="control-icon-btn" title="Auswahl löschen     ENTF">&#985722;</div>
        </div>

        <div class="more-menu" :class="{'active': moreMenu}">
            <div class="option" @click="emit('new')">
                <div class="text">Neu</div>
                <div class="shortcut">STRG + N</div>
            </div>
            <div class="option" @click="emit('open')">
                <div class="text">Öffnen</div>
                <div class="shortcut">STRG + O</div>
            </div>

            <div class="divider"></div>

            <div class="option" @click="emit('save')">
                <div class="text">Speichern</div>
                <div class="shortcut">STRG + S</div>
            </div>
            <div class="option" @click="emit('save-as')">
                <div class="text">Speichern als</div>
                <div class="shortcut">STRG + UMSCHALT + S</div>
            </div>

            <div class="divider"></div>

            <div class="option" @click="emit('export')">
                <div class="text">Exportieren</div>
                <div class="shortcut">STRG + E</div>
            </div>
            <div class="option" @click="emit('settings')">
                <div class="text">Einstellungen</div>
                <div class="shortcut">STRG + UMSCHALT + E</div>
            </div>
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
            top: 75px
            left: 0px
            width: 300px
            text-align: left
            height: calc(100% - 75px)
            background: var(--background)
            border-radius: 0px 7px 0px 0px
            z-index: 2
            margin-bottom: 10px
            padding: 15px 0
            transition: all 200ms cubic-bezier(0.65, 0.05, 0.36, 1)
            transform: translateX(-100%)

            &.active
                transform: translateX(0%)

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