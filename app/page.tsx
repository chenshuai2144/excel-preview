'use client';
import {
  Upload,
  App,
  ConfigProvider,
  message,
  Modal,
  Tree,
  Button,
  Select,
  Form,
} from 'antd';
import * as XLSX from 'xlsx';
import { useState } from 'react';
import zh_CN from 'antd/es/locale/zh_CN';
import theme from 'antd/es/theme';
import { SliderPage } from './components/Slider';
import FormItem from 'antd/es/form/FormItem';

export default function Home() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [primaryKey, setPrimaryKey] = useState<string>('');

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [view, setView] = useState<'upload' | 'keySelect' | 'slider'>('upload');
  function handleFile(file: File) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        var reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target?.result;
          var workbook = XLSX.read(data, { type: 'binary' });

          const fileData = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          setDataSource(fileData as unknown as any[]);
          const keys = Object.keys(fileData?.at(0) as any) as string[];
          setSelectedKeys(keys);
          setPrimaryKey(keys.find((key) => key.includes('id')) || keys[0]);
          resolve(true);
          /* DO SOMETHING WITH workbook HERE */
        };
        reader.readAsBinaryString(file);
      }, 200);
    });
  }

  const firstObject = dataSource?.at(0) || {};

  return (
    <App>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
        locale={zh_CN}
      >
        <>
          {view === 'upload' && (
            <Upload.Dragger
              style={{
                width: 600,
                margin: '32px auto',
              }}
              fileList={[]}
              onChange={async (e) => {
                if (
                  e.file.originFileObj?.name?.endsWith('.csv') ||
                  e.file.originFileObj?.name?.endsWith('.xls') ||
                  e.file.originFileObj?.name?.endsWith('.xlsx')
                ) {
                  const hideLoading =
                    message.loading('🐱 miu 姐正在帮你看，稍等哦');
                  await handleFile(e.file.originFileObj);
                  hideLoading();
                  setView('keySelect');
                  return;
                }
                message.error(
                  '🐱 miu 姐会不高兴的，请上传 .csv .xls .xlsx 格式文件'
                );
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  width: 600,
                  margin: 'auto',
                  justifyItems: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  width={120}
                  alt="miu 姐"
                  src="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*88xbQaYvP4YAAAAAAAAAAAAADml6AQ/original"
                />
                <p>点击或者拖动让 miu 姐帮你看看</p>
                <p>支持 .xls .xlsx .csv 格式</p>
              </div>
            </Upload.Dragger>
          )}
          {view === 'keySelect' && (
            <Modal
              closeIcon={' '}
              footer={
                <Button
                  type="primary"
                  onClick={() => {
                    if (!primaryKey) {
                      message.warning('请选择主键');
                      return;
                    }
                    if (selectedKeys.length < 2) {
                      message.warning('请至少包含2列，一列主键，一列值');
                      return;
                    }
                    if (!selectedKeys.includes(primaryKey)) {
                      message.warning('选中的列一定要包含主键');
                      return;
                    }
                    setView('slider');
                  }}
                >
                  确认
                </Button>
              }
              open={view === 'keySelect'}
            >
              <Form layout="vertical">
                <FormItem
                  label="请选择选择需要审阅的数据："
                  style={{
                    margin: 24,
                  }}
                >
                  <Tree
                    treeData={Object.keys(firstObject).map((key) => {
                      return {
                        title: key,
                        key,
                      };
                    })}
                    checkedKeys={selectedKeys}
                    checkable
                    onCheck={(keys) => {
                      setSelectedKeys(keys as string[]);
                    }}
                  />
                </FormItem>
                <FormItem
                  tooltip="主键就是  uuid  之类的，不会重复的值,不设置可以导致重复"
                  label="请选择主键"
                  style={{
                    margin: 24,
                  }}
                >
                  <Select
                    value={primaryKey}
                    onChange={(e) => {
                      setPrimaryKey(e);
                    }}
                    options={Object.keys(firstObject).map((key) => {
                      return {
                        label: key,
                        key,
                        value: key,
                      };
                    })}
                  />
                </FormItem>
              </Form>
            </Modal>
          )}
          {view === 'slider' && (
            <SliderPage
              list={dataSource}
              rowKey={primaryKey}
              selectedKeys={selectedKeys}
              onBack={() => {
                setView('upload');
              }}
            />
          )}
        </>
      </ConfigProvider>
    </App>
  );
}
