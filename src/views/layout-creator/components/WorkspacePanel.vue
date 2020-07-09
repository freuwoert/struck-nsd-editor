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

            <div class="copyright"><span>&#984550;</span> Maurice Freuwört</div>
        </div>
    </div>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex'
    import DragUnit from '../../components/DragUnitInput'
    import StructureInput from '../../components/StructureInput'
    import { EventBus } from '../../../assets/js/event-bus.js'
    import Colorpicker from '../../components/Colorpicker'
    import Structure from './Structure'

    export default {
        computed: {
            ...mapGetters([
                'docStructures'
            ]),
        },
        methods: {
            ...mapActions([
                'createElement'
            ]),

            mouseDown(event) {
                EventBus.$emit('toggle-create-element', {event, trace: 'N:0', position: 'above'})
            }
        },
        components: {
            DragUnit,
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

        .copyright
            font-size: 12px
            line-height: 18px
            font-weight: 800
            letter-spacing: 1px
            text-transform: uppercase
            color: #00000040
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
                opacity: 0.7

        .center
            position: absolute
            top: 5px
            left: 0
            width: 100%
            height: calc(100% - 5px)
            padding: 50px 0 100px
            overflow: auto
            text-align: center
            user-select: none

            .structure-container
                min-width: 200px
                min-height: 60px
                padding: 15px
                border-radius: 7px
                background: var(--background)
                font-family: 'Roboto Mono', monospace
                position: relative
</style>