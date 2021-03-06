/**
 * Created by XiaoYu on 2017/6/19.
 */
import React, {Component} from 'react';
import { Table, Button, Modal, Input, Form, Popconfirm } from 'antd';
import { Map, List } from 'immutable';
import LabelModel from '../../../models/LabelData';
import CommonFun from '../../../components/util/utils';//公共方法
const FormItem = Form.Item;
const LabelData = new LabelModel();

class ModalAdd extends Component{

  render() {
    const { getFieldDecorator } = this.props.getFieldDecorator;
    return (
      <div>
        <FormItem
          label="名称:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('name', {
            rules: [{
              required: true,
              message: '请输入标签名称',
            }],
          })(
            <Input className="search_item"/>
          )}
        </FormItem>
        <FormItem
          label="代码:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('code', {
            rules: [{
              required: true,
              message: '请输入代码',
            }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          label="点评对象编码:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('objectType', {
            rules: [{
              required: true,
              message: '请输入点评对象编码',
            }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          label="描述:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('description')(
            <Input/>
          )}
        </FormItem>
      </div>
    )
  }
}

class ModalEdit extends Component {
  render() {
    const detail = this.props.detail;
    const { getFieldDecorator } = this.props.getFieldDecorator;
    return (
      <div>
        <FormItem
          label="名称:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('name', {
            initialValue: detail.name,
            rules: [{
              required: true,
              message: '请输入名称',
            }]
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          label="编码:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('code', {
            initialValue: detail.code,
            rules: [{
              required: true,
              message: '请输入编码',
            }]
          })(
            <Input/>
          )}
        </FormItem>

        <FormItem
          label="点评对象编码:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('objectType', {
            rules: [{
              required: true,
              message: '请输入点评对象编码',
            }],
            initialValue: detail.objectType
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          label="描述:"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17,offset:1 }}
        >
          {getFieldDecorator('description', {
            initialValue: detail.description
          })(
            <Input/>
          )}
        </FormItem>
      </div>
    )
  }
}

class ModalLook extends Component {
  render() {
    const detail = this.props.detail;
    return (
      <div>
        <div className="input_item">
          <label>名称:</label>
          <p>{ detail.name }</p>
        </div>
        <div className="input_item">
          <label>编码:</label>
          <p>{ detail.code }</p>
        </div>
        <div className="input_item">
          <label>点评对象编码:</label>
          <p>{ detail.objectType }</p>
        </div>
        <div className="input_item">
          <label>描述:</label>
          <p>{ detail.description }</p>
        </div>
        <div className="input_item">
          <label>创建时间:</label>
          <p>{ detail.createDateText }</p>
        </div>
      </div>
    )
  }
}
class LabelList extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      {title: '名称', dataIndex: 'name', key: 'name'},
      {title: '编码', dataIndex: 'code', key: 'code'},
      {title: '点评对象编码', dataIndex: 'objectType', key: 'objectType'},
      {title: '描述', dataIndex: 'description', key: 'description'},
      {title: '创建日期', dataIndex: 'createDateText', key: 'createDate'},
      {
        title: '操作',
        key: 'operation',
        render: (text, record, index) => {
          return (
            <div>
              <a className="operationBtn" onClick={ this.modelTool().showModal.bind(this , text, 'look') }
                 href="javascript:;">查看</a>
              <a className="operationBtn"  onClick={ this.modelTool().showModal.bind(this , text, 'edit') } href="javascript:;">修改</a>
              <Popconfirm title="是否删除？" onConfirm={ this.modelTool().deleteItem.bind(this, text, 'delete') } okText="确定"
                          cancelText="取消">
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </div>
          )
        }
      }
    ];

    this.state = {
      dataSource: [],
      currentPage: 1,
      visible: false,
      dataDetail: {
        key: '',
        name: '',
        age: '',
        address: ''
      },
      newKey: 1,
      detailState: ''
    };

    //table配置
    this.option = {
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
          console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log(selected, selectedRows, changeRows);
        }
      }
    }
  }
  //数据转换
  convert() {
    const result = this.props.result.resultList;
    const res = result.map((item, index)=> {
      return {
        key: index,
        createDateText: CommonFun.dateFormat('yyyy-MM-dd HH:mm:ss', item.createDate),
        ...item
      }
    });
    return res;
  }
  //详情弹层
  modelTool = () => {
    return {
      showModal: (data, type, event) => {
        this.setState({
          visible: true,
          dataDetail: data,
          newKey: ++this.state.newKey,
          detailState: type
        });
      },
      //删除
      deleteItem: (data, type) => {
        console.log(data);
        const sendData = {
          isDel:1,
          id: data.id
        };
        LabelData.editLabel(sendData).then(data => {
          if (data.ok) {
            this.props.refreshList();
          }
        });
      },
      //修改弹层提交
      handleOk: () => {
        this.props.form.validateFields((err, fieldsValue) => {
          const sendData = {
            ...fieldsValue,
            id: this.state.dataDetail.id
          };
          if (!err) {
            LabelData.editLabel(sendData).then(data => {
              if (data.ok) {
                this.setState({
                  visible: false
                });
                this.props.refreshList();
              }
            });
          }
        });
      },
      //弹层返回
      handleCancel: () => {
        this.setState({
          visible: false,
        });
      },
      //新增弹层提交
      addHandleOk: () => {
        this.props.form.validateFields((err, fieldsValue) => {
          if (!err) {
            LabelData.addLabel(fieldsValue).then(data => {
              if (data.ok) {
                this.setState({
                  visible: false
                });
                this.props.refreshList();
              }
            });
          }
        });
      },
      //添加
      handleAdd: () => {
        this.setState({
          visible: true,
          detailState: 'add',
          newKey: ++this.state.newKey
        });
      }
    }
  };

  render() {
    const { currentPage } = this.state;
    const columns = this.columns;
    const result = this.convert();
    const getFieldDecorator = this.props.form;
    const paginationOption = {
      current:this.props.condition.currentPage,
      total: this.props.result.total,
      onChange: (page) => {
        this.props.changePage(page);
        this.setState({
          currentPage: page
        })
      }
    };

    let ModalComponent;
    if (this.state.detailState == 'add') {
      ModalComponent = <ModalAdd  ref='addModal' getFieldDecorator={ getFieldDecorator }/>
    } else if (this.state.detailState == 'look') {
      ModalComponent =  <ModalLook detail={ this.state.dataDetail }/>
    } else if (this.state.detailState == 'edit') {
      ModalComponent = <ModalEdit detail={ this.state.dataDetail } getFieldDecorator={ getFieldDecorator }/>
    }
    return (
      <div>
        <Form>
          <Modal
            className={ (this.state.detailState == 'look') ? 'lookModal' : '' }
            key={ this.state.newKey }
            title={ (this.state.detailState == 'add') ? '添加' : (this.state.detailState == 'look')?'查看':'编辑' }
            visible={ this.state.visible }
            onOk={ (this.state.detailState == 'add') ? this.modelTool().addHandleOk : this.modelTool().handleOk }
            onCancel={ this.modelTool().handleCancel }
          >
            { ModalComponent }
          </Modal>
        </Form>
        <Button style={{ margin:'20px 0 5px 0' }} type="primary" onClick={ this.modelTool().handleAdd }>添加</Button>
        <p style={{ marginBottom:'10px',fontSize:'12px' }}>
          共计{ this.props.result.total }条，每页显示{ 10 }条，当前显示为第{ currentPage }页</p>
        <Table pagination={ paginationOption } loading={ this.props.status } { ...this.option } columns={ columns }
               dataSource={ result }
               rowKey={ record  => record.key }/>
      </div>
    );
  }
}


export default Form.create()(LabelList);


