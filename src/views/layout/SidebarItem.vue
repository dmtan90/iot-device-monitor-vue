<template>
	<div class='menu-wrapper'>
	
	<template v-for="item in routes">
		<el-submenu :index="item.title" :key="item.code">
			<template slot="title">
				<icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg>
				<span>{{item.title}}</span>
			</template>
			<template v-for="child in item.children">
				<sidebar-item class='nest-menu' v-if='child.children&&child.children.length>0' :routes='[child]' :key="child.code"> </sidebar-item>
				<router-link v-else :to="'/'+item.code+'/'+child.code" :key="child.code">
					<el-menu-item :index="item.code+'/'+child.code">
						<icon-svg v-if='child.icon' :icon-class="child.icon"></icon-svg>
						<span>{{child.title}}</span>
					</el-menu-item>
				</router-link>
			</template>
		</el-submenu>

	</template>

	</div>
</template>

<script>
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

