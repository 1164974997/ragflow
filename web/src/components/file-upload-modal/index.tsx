import { useTranslate } from '@/hooks/common-hooks';
import { IModalProps } from '@/interfaces/common';
import { InboxOutlined } from '@ant-design/icons';
import {
  Flex,
  Modal,
  Segmented,
  Select,
  Tabs,
  TabsProps,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { Dispatch, SetStateAction, useState } from 'react';

import styles from './index.less';

const { Dragger } = Upload;
const { Text } = Typography;

const FileUpload = ({
  directory,
  fileList,
  setFileList,
}: {
  directory: boolean;
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
}) => {
  const { t } = useTranslate('fileManager');
  const props: UploadProps = {
    multiple: true,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList((pre) => {
        return [...pre, file];
      });

      return false;
    },
    directory,
    fileList,
  };

  return (
    <Dragger {...props} className={styles.uploader}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">{t('uploadTitle')}</p>
      <p className="ant-upload-hint">{t('uploadDescription')}</p>
      {false && <p className={styles.uploadLimit}>{t('uploadLimit')}</p>}
    </Dragger>
  );
};

const FileUploadModal = ({
  visible,
  hideModal,
  loading,
  onOk: onFileUploadOk,
}: IModalProps<UploadFile[]>) => {
  const { t } = useTranslate('fileManager');
  const [value, setValue] = useState<string | number>('local');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [directoryFileList, setDirectoryFileList] = useState<UploadFile[]>([]);
  const [fileType, setFileType] = useState<string>('10k'); // 默认选择10k类型

  const clearFileList = () => {
    setFileList([]);
    setDirectoryFileList([]);
  };

  const onOk = async () => {
    // 将fileType和文件一起提交给上传接口
    const ret = await onFileUploadOk?.(
      [...fileList, ...directoryFileList],
      fileType,
    );
    return ret;
  };

  const afterClose = () => {
    clearFileList();
    setFileType('10k'); // 重置为默认类型
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('file'),
      children: (
        <FileUpload
          directory={false}
          fileList={fileList}
          setFileList={setFileList}
        ></FileUpload>
      ),
    },
    {
      key: '2',
      label: t('directory'),
      children: (
        <FileUpload
          directory
          fileList={directoryFileList}
          setFileList={setDirectoryFileList}
        ></FileUpload>
      ),
    },
  ];

  return (
    <>
      <Modal
        title={t('uploadFile')}
        open={visible}
        onOk={onOk}
        onCancel={hideModal}
        confirmLoading={loading}
        afterClose={afterClose}
      >
        <Flex gap={'large'} vertical>
          <Segmented
            options={[
              { label: t('local'), value: 'local' },
              { label: t('s3'), value: 's3' },
            ]}
            block
            value={value}
            onChange={setValue}
          />
          {value === 'local' ? (
            <>
              <Flex gap="middle" align="center">
                <Text>
                  {t('fileType', { keyPrefix: 'common' }) || '文件类型'}:
                </Text>
                <Select
                  style={{ width: 120 }}
                  value={fileType}
                  onChange={setFileType}
                  options={[
                    { value: '10k', label: '10K' },
                    { value: '10q', label: '10Q' },
                  ]}
                />
              </Flex>
              <Tabs defaultActiveKey="1" items={items} />
            </>
          ) : (
            t('comingSoon', { keyPrefix: 'common' })
          )}
        </Flex>
      </Modal>
    </>
  );
};

export default FileUploadModal;
