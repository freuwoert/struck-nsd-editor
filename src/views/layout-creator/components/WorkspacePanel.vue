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
                min-width: 300px
                min-height: 60px
                padding: 15px
                border-radius: 7px
                background: var(--background)
                font-family: 'Roboto Mono', monospace
                position: relative
                --eh: 46px
                --hh: 30px
</style>