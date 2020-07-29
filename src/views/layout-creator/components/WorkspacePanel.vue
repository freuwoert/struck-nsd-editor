<template>
    <div class="workspace">
        <div class="center">
            <!-- <colorpicker></colorpicker> -->
            <structure-input @create-element="createElement($event)"></structure-input>

            <div class="structure-container">
                <div @dragstart.prevent @mousedown="mouseDown($event)" class="hitbox first"></div>
                <structure v-for="(child, i) in docStructures.children" :key="i" :trace="'N:'+i" :structure="child"></structure>

                <div class="placeholder" v-show="docStructures.children.length == 0"></div>
            </div>

            <div class="context-menu" ref="contextMenuDOM" v-show="contextMenuUI" :style="'left: '+contextMenu[0]+'px; top: '+contextMenu[1]+'px;'">
                <div class="item" :class="{'disabled': contextInfo.context === 'switch-slot'}" @click="deleteElement()">Element löschen</div>
                <div class="divider"></div>
                <div class="item" :class="{'disabled': contextInfo.context !== 'switch'}" @click="addCase()">Case hinzufügen</div>
                <div class="item" :class="{'disabled': contextInfo.context !== 'switch-slot'}" @click="deleteElement()">Case löschen</div>
            </div>

            <div class="history">
                <div class="action" v-for="(action, i) in debugDOC.history" :key="i" :class="{'active': i == debugDOC.historyPosition}">{{action.action}}</div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import StructureInput from '../../components/StructureInput'
    import { EventBus } from '../../../assets/js/event-bus.js'
    import Colorpicker from '../../components/Colorpicker'
    import Structure from './Structure'

    export default {
        computed: {
            ...mapGetters([
                'docStructures',
                'contextMenuUI',
                'contextMenu',
                'contextInfo',
                'debugDOC',
            ]),
        },
        mounted() {
            window.addEventListener('mousedown', (event) => {
                this.blurContextMenu(event)
            })

            window.addEventListener('contextmenu', (event) => {
                this.blurContextMenu(event)
            })
        },
        methods: {
            ...mapActions([
                'createElement',
                'setContextMenuUI',
                'deleteElements',
                'addSlot',
            ]),

            mouseDown(event) {
                EventBus.$emit('toggle-create-element', {event, trace: 'N:0', position: 'above'})
            },

            blurContextMenu(event) {
                let blur = true

                for (const DOM of event.path)
                {
                    if( DOM == this.$refs.contextMenuDOM ) blur = false
                }
                
                if( blur )
                {
                    this.setContextMenuUI(false)
                }
            },

            // Context menu methods
            addCase() {
                this.addSlot(this.contextInfo.uuid)
                this.setContextMenuUI(false)
            },

            deleteElement() {
                this.deleteElements({elementUUIDs: [this.contextInfo.uuid]})
                this.setContextMenuUI(false)
            }
        },
        components: {
            Colorpicker,
            Structure,
            StructureInput,
        }
    }
</script>
<style lang="sass" scoped>
    .workspace
        grid-area: workspace
        background: var(--dark-background)
        overflow: hidden
        position: relative

        .history
            width: 270px
            height: 500px
            background: var(--background)
            position: absolute
            top: 0
            right: 5px
            border-radius: 7px
            overflow-y: auto

            .action
                width: 100%
                height: 30px
                line-height: 20px
                text-align: left
                font-size: 15px
                font-weight: 700
                padding: 5px 8px
                color: var(--color)
                border-left: 4px solid transparent

                &.active
                    border-color: var(--primary)

        .context-menu
            background: var(--background)
            filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.3))
            border-radius: 10px
            overflow: hidden
            position: fixed
            top: 0
            left: 0
            padding: 10px 0
            user-select: none
            z-index: 100

            .item
                height: 30px
                min-width: 190px
                display: block
                font-size: 14px
                font-weight: 600
                text-align: left
                line-height: 30px
                border-radius: 5px
                padding: 0 15px
                color: var(--color)

                &:hover:not(.disabled)
                    background: var(--primary)
                    color: white
                    cursor: pointer

                &.disabled
                    color: var(--color-light)
                    pointer-events: none

            .divider
                width: calc(100% - 30px)
                border-bottom: 1px solid var(--color-lighter)
                margin: 10px 15px

        .center
            position: absolute
            top: 5px
            left: 0
            width: 100%
            height: calc(100% - 5px)
            padding: 50px 50px 100px
            overflow: auto
            text-align: center
            user-select: none

            .structure-container
                min-width: 200px
                min-height: 60px
                padding: 15px
                border-radius: 7px
                background: var(--background)
                font-family: 'SCP', monospace
                position: relative
</style>