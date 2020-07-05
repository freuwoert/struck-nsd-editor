<template>
    <div class="structure" :class="structure.type">
        <div v-if="structure.type === 'do-while'" class="loop-container">
            <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
            <div class="placeholder" v-show="structure.children.length == 0"></div>
        </div>

        <div class="content">{{structure.content}}</div>

        <svg v-show="structure.type === 'break'" class="break-path" preserveAspectRatio="none" viewBox="0 0 10 40">
            <polyline points="10 0 0 20 10 40"></polyline>
        </svg>

        <div v-if="structure.type === 'while' || structure.type === 'endless-loop'" class="loop-container">
            <structure v-for="(child, i) in structure.children" :key="i" :trace="trace+'-N:'+i" :structure="child"></structure>
            <div class="placeholder" v-show="structure.children.length == 0"></div>
        </div>

        <div v-if="structure.type === 'if' || structure.type === 'switch'" class="condition-container">
            <div class="condition-slot" v-for="(slot, i) in structure.slots" :key="i">
                <div class="label">{{slot.content}}</div>
                <structure v-for="(child, j) in slot.children" :key="j" :trace="trace+'-'+i+':'+j" :structure="child"></structure>
                <div class="placeholder" v-show="slot.children == 0"></div>

                <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" class="hitbox slot"></div>
            </div>
        </div>

        <svg class="if-path" v-if="structure.type === 'if' || structure.type === 'switch'" preserveAspectRatio="none" viewBox="0 0 400 40">
            <polyline points="0 0 200 40 400 0"></polyline>
        </svg>



        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'command'" class="hitbox command"></div>
        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'call'" class="hitbox call"></div>
        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'break'" class="hitbox break"></div>

        <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" v-if="structure.type === 'while'" class="hitbox while-top"></div>
        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'while'" class="hitbox while-bottom"></div>

        <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" v-if="structure.type === 'do-while'" class="hitbox do-while-top" :class="{'full-size': structure.children.length == 0}"></div>
        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'do-while'" class="hitbox do-while-bottom"></div>

        <div @dragstart.prevent @mousedown="mouseDown($event, 'into')" v-if="structure.type === 'endless-loop'" class="hitbox endless-loop-top"></div>
        <div @dragstart.prevent @mousedown="mouseDown($event, 'below')" v-if="structure.type === 'endless-loop'" class="hitbox endless-loop-bottom"></div>
    </div>
</template>

<script>
    import StructureInput from '../../components/StructureInput'
    import { EventBus } from '../../../assets/js/event-bus.js'

    export default {
        name: 'structure',
        props: {
            structure: {
                type: Object,
                required: true
            },
            trace: {}
        },
        methods: {
            mouseDown(event, position) {
                EventBus.$emit('toggle-create-element', {event, trace: this.trace, position})
            }
        },
        components: {
            StructureInput,
        }
    }
</script>

<style lang="sass">
    .placeholder
        background-image: url('~@/assets/images/interface/general/line.svg')
        background-size: 20px
        background-position: top center
        height: var(--eh)
        width: 100%
        border: 1px solid black

    .hitbox
        background: #0057ff55
        border-radius: 5px
        width: 0
        height: var(--hh)
        position: absolute
        bottom: calc(var(--hh) / 2 * -1)
        left: 0
        z-index: 10
        opacity: 0
        cursor: pointer

        &:hover
            opacity: 1

        &.command,
        &.call,
        &.break,
        &.do-while-bottom,
        &.endless-loop-bottom
            width: 100%

        &.while-bottom
            width: 20px

        &.slot
            width: 100%
            top: 5px

        &.while-top
            left: 20px
            top: calc(var(--eh) - var(--hh) / 2)
            width: calc(100% - 20px)

        &.do-while-top
            left: 0
            top: -5px
            width: 20px

            &.full-size
                width: calc(100% - 20px)
                left: 20px
                top: -15px

        &.endless-loop-top
            left: 20px
            top: calc(var(--eh) - var(--hh) / 2)
            width: calc(100% - 20px)

        &.first
            height: var(--hh)
            left: 15px
            top: 0
            width: calc(100% - 30px)

    .structure
        display: block
        text-align: left
        position: relative
        margin-top: -1px
        color: black
        border: 1px solid black
        background: white

        .content
            font-size: 15px
            min-height: var(--eh)
            padding: 13px
            line-height: 20px
            min-width: 300px
            text-align: center
            display: block

        .condition-container
            display: flex
            min-height: var(--eh)
            width: 100%
            margin-right: -1px
            margin-bottom: -1px
            margin-top: -20px

            .condition-slot
                flex: 1
                min-height: var(--eh)
                margin-right: -1px
                position: relative

                .label
                    height: 20px
                    line-height: 20px
                    padding-left: 5px
                    width: 100%
                    font-size: 14px
                    color: black
                    text-align: left

                &:first-of-type
                    margin-left: -1px

                &:last-of-type > .label
                    text-align: right
                    padding-right: 5px

        .loop-container
            display: block
            min-height: var(--eh)
            width: calc(100% - 19px)
            margin-left: 20px
            margin-right: -1px

        &.break
            .break-path
                height: calc(100% + 2px)
                width: 11.5px
                position: absolute
                top: -1px
                left: -0.5px
                stroke: #000
                stroke-width: 0.8px
                fill: none


        &.if > .content
            position: relative
            z-index: 1
            padding: 2px 10px

        &.switch > .content
            position: relative
            z-index: 1
            padding: 2px 10px

        &.if, &.switch
            .if-path
                height: var(--eh)
                width: 100%
                position: absolute
                top: 0
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none

                polyline
                    fill: white

        &.call
            .content
                position: relative
                &::before
                    content: ''
                    position: absolute
                    left: 10px
                    top: -1px
                    height: calc(100% + 2px)
                    border-right: 1px solid black

                &::after
                    content: ''
                    position: absolute
                    right: 10px
                    top: -1px
                    height: calc(100% + 2px)
                    border-left: 1px solid black

        &.while
            .loop-container
                margin-bottom: -1px

        &.do-while
            .loop-container
                margin-top: -1px

        &.endless-loop
            padding-bottom: calc(var(--eh) - 1px)
</style>