'use client';

import { useMemo, useState } from 'react';
import { Tag, Image, theme, Button, FloatButton, Drawer, Table } from 'antd';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

export const SliderPage: React.FC<{
  list: any[];
  rowKey: string;
  selectedKeys: string[];
}> = (props) => {
  console.log(props.selectedKeys);
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(0);
  const [unusedList, setUnusedList] = useState<any[]>([]);

  const [successList, setSuccessList] = useState<any[]>([]);
  const [currentList, setCurrentList] = useState<any[]>([]);

  const [unusedListOpen, setUnusedListOpen] = useState<boolean>(false);
  const [successListOpen, setSuccessListOpen] = useState<boolean>(false);

  const render = (text: string | number, key: string) => {
    if (!text) return '-';
    if (typeof text === 'number')
      return (
        <div
          style={{
            color: token.colorText,
            display: 'flex',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 85,
              textAlign: 'right',
            }}
          >
            {key}
          </div>
          <div
            style={{
              flex: 1,
            }}
          >
            <span>: {text}</span>
          </div>
        </div>
      );

    if (text?.startsWith('http')) {
      return <Image alt="图片" src={text} key="text" width={50} height={50} />;
    }
    if (text?.startsWith('[') && text?.endsWith(']')) {
      const list = JSON.parse(text);
      if (Array.isArray(list)) {
        return (
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              justifyContent: 'center',
              color: token.colorTextHeading,
            }}
          >
            <Image.PreviewGroup>
              {list.map((item) => {
                if (item?.startsWith('http')) {
                  return <Image alt="图片" src={item} key="item" width={100} />;
                }
                return item;
              })}
            </Image.PreviewGroup>
          </div>
        );
      }
    }
    if (!key) return null;
    return (
      <div
        style={{
          color: token.colorText,
          display: 'flex',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 130,
            textAlign: 'right',
          }}
        >
          {key} :
        </div>
        <div
          style={{
            flex: 1,
          }}
        >
          {' '}
          <span> {text}</span>
          {'  '}
          <Tag
            style={{
              height: 24,
              maxHeight: 24,
            }}
          >
            {text?.length}
          </Tag>
        </div>
      </div>
    );
  };
  const { token } = theme.useToken();
  const columns = useMemo(() => {
    return props.selectedKeys.map((key) => {
      return {
        title: key,
        dataIndex: key,
      };
    });
  }, [props.selectedKeys.toString()]);
  const itemKeys = props.selectedKeys;
  const item = props.list.at(current);
  return (
    <div>
      <div
        key={item[props.rowKey]}
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100vw',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '42vw',
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            height: '60vh',
            justifyContent: 'center',
          }}
        >
          <motion.div
            layout
            id="card"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0, 0.71, 0.2, 1.01],
            }}
            style={{
              padding: 24,
              display: 'flex',
              borderRadius: 8,
              gap: 8,
              transform: 'all 0.3s',
              flexDirection: 'column',
              boxShadow: token.boxShadow,
              border: `1px solid ${token.colorSplit}`,
            }}
          >
            {itemKeys.map((key) => {
              return render(item[key], key);
            })}
          </motion.div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 40,
            transition: 'all 1.2s',
            color: token.colorText,
            gap: 24,
          }}
          onClick={() => {
            if (current === currentList.length - 1) {
              setCurrent(0);
              setPage(page + 1);
            }
          }}
        >
          <Button
            onClick={() => {
              if (current === 9) {
                setCurrent(0);
                setPage(page + 1);
              }
              setCurrent(current + 1);
              setSuccessList([...successList, item]);
              setCurrentList(
                currentList.filter(
                  (listItem) => listItem[props.rowKey] !== item[props.rowKey]
                )
              );
            }}
          >
            ❤️
          </Button>
          <Button
            onClick={() => {
              if (current === 9) {
                setCurrent(0);
                setPage(page + 1);
              }
              setCurrent(current + 1);
              setUnusedList([...unusedList, item]);
              setCurrentList(
                currentList.filter(
                  (listItem) => listItem[props.rowKey] !== item[props.rowKey]
                )
              );
            }}
          >
            🌶️
          </Button>
        </div>
      </div>

      <FloatButton
        style={{
          left: 20,
        }}
        badge={{
          count: successList.length,
        }}
        onClick={() => {
          setSuccessListOpen(true);
        }}
        icon={'❤️'}
      />
      <FloatButton
        badge={{
          count: unusedList.length,
        }}
        onClick={() => {
          setUnusedListOpen(true);
        }}
        icon={'🌶️'}
      />
      <Drawer
        onClose={() => {
          setSuccessListOpen(false);
        }}
        placement="left"
        open={successListOpen}
        width={'60vw'}
      >
        <Button
          type="primary"
          style={{
            margin: '12px 0',
          }}
          onClick={() => {
            var ws = XLSX.utils.json_to_sheet(successList);

            /* add to workbook */
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '选中的数据');

            /* generate an XLSX file */
            XLSX.writeFile(wb, 'sheetjs.xlsx');
          }}
        >
          导出为 excel
        </Button>
        <Table
          scroll={{
            x: 2000,
          }}
          columns={columns}
          dataSource={successList}
          size="small"
        />
      </Drawer>
      <Drawer
        onClose={() => {
          setUnusedListOpen(false);
        }}
        placement="right"
        open={unusedListOpen}
        width={'60vw'}
      >
        <Button
          type="primary"
          style={{
            margin: '12px 0',
          }}
          onClick={() => {
            var ws = XLSX.utils.json_to_sheet(unusedList);

            /* add to workbook */
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '为选中数据');

            /* generate an XLSX file */
            XLSX.writeFile(wb, 'sheetjs.xlsx');
          }}
        >
          导出为 excel
        </Button>
        <Table
          scroll={{
            x: 2000,
          }}
          columns={columns}
          dataSource={unusedList}
          size="small"
        />
      </Drawer>
    </div>
  );
};
