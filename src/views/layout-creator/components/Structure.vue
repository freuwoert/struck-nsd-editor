<template>
    <div class="structure" :class="structure.type">
        <div v-if="structure.type === 'do-while'" class="loop-container">
            <structure v-for="(child, i) in structure.children" :key="i" :structure="child"></structure>
            <div class="placeholder" v-show="structure.children.length == 0"></div>
        </div>

        <div class="content">{{structure.content}}</div>

        <svg v-show="structure.type === 'break'" class="break-path" preserveAspectRatio="none" viewBox="0 0 10 40">
            <polyline points="10 0 0 20 10 40"></polyline>
        </svg>

        <div v-if="structure.type === 'while' || structure.type === 'endless-loop'" class="loop-container">
            <structure v-for="(child, i) in structure.children" :key="i" :structure="child"></structure>
            <div class="placeholder" v-show="structure.children.length == 0"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'structure',
        props: {
            structure: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style lang="sass">
    .placeholder
        background-image: url('~@/assets/images/interface/general/line.svg')
        background-size: 20px
        background-position: top center
        height: 40px
        width: 100%
        border: 1px solid black

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
            min-height: 40px
            padding: 10px
            line-height: 20px
            min-width: 300px
            text-align: center
            display: block

        .loop-container
            display: block
            min-height: 40px
            width: calc(100% - 19px)
            margin-left: 20px
            margin-right: -1px

        &.break
            .break-path
                height: calc(100% + 2px)
                width: 10px
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

        &.if
            .if-path
                height: 40px
                width: 100%
                position: absolute
                top: 0
                left: 0
                stroke: #000
                stroke-width: 0.8px
                fill: none

                polyline
                    fill: white

            .item-align

                .if-container
                    min-height: 40px
                    min-width: 60px
                    vertical-align: top

        &.call
            .content
                position: relative
                &::before
                    content: ''
                    position: absolute
                    left: 10px
                    top: 0
                    height: 100%
                    border-right: 1px solid black

                &::after
                    content: ''
                    position: absolute
                    right: 10px
                    top: 0
                    height: 100%
                    border-left: 1px solid black

        &.while
            .loop-container
                margin-bottom: -1px

        &.do-while
            .loop-container
                margin-top: -1px

        &.endless-loop
            padding-bottom: 39px
</style>