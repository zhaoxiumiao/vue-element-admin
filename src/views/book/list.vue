<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width: 200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="`${item.label}(${item.num})`"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left: 10px"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left: 5px"
        @click="handleCreate"
      >
        新增
      </el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left: 5px"
        @change="changeShowCover"
      >
        显示封面
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
      />
      <el-table-column
        label="书名"
        width="150"
        align="center"
      >
        <!-- slot-scope -->
        <template v-slot="{row: {title}}">
          <span>{{ title }}</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="0"
    />
  </div>
</template>

<script>
import Pagination from '../../components/Pagination/index'
import waves from '../../directive/waves/index'
import { getCategory, listBook } from '../../api/book'
export default {
  directives: {
    waves
  },
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {

      },
      showCover: false,
      categoryList: [],
      listLoading: true,
      tableKey: 0,
      list: []
    }
  },
  mounted() {
    this.getList()
    this.getCategoryList()
  },
  methods: {
    sortChange() {
      console.log('sortChange')
    },
    getList() {
      this.listLoading = true
      listBook(this.listQuery).then(response => {

      })
    },
    getCategoryList() {
      getCategory().then(response => {
        this.categoryList = response.data
        console.log(this.categoryList)
      })
    },
    handleFilter() {
      console.log('handleFilter', this.listQuery)
      this.getList()
    },
    handleCreate() {
      this.$router.push('/book/create')
    },
    changeShowCover(value) {
      console.log(this.showCover)
      this.$data.showCover = value
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
