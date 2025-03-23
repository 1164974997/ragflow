import KnowledgeBaseItem from '@/components/knowledge-base-item';
import { useTranslate } from '@/hooks/common-hooks';
import { useFetchTenantInfo } from '@/hooks/user-setting-hooks';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Input, Select, Space, Switch, Upload, message } from 'antd';
import classNames from 'classnames';
import { useCallback } from 'react';
import { ISegmentedContentProps } from '../interface';

import styles from './index.less';

const emptyResponseField = ['prompt_config', 'empty_response'];

const AssistantSetting = ({
  show,
  form,
  setHasError,
}: ISegmentedContentProps) => {
  const { t } = useTranslate('chat');
  const { data } = useFetchTenantInfo(true);

  const handleChange = useCallback(() => {
    const kbIds = form.getFieldValue('kb_ids');
    const emptyResponse = form.getFieldValue(emptyResponseField);

    const required =
      emptyResponse && ((Array.isArray(kbIds) && kbIds.length === 0) || !kbIds);

    setHasError(required);
    form.setFields([
      {
        name: emptyResponseField,
        errors: required ? [t('emptyResponseMessage')] : [],
      },
    ]);
  }, [form, setHasError, t]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleTtsChange = useCallback(
    (checked: boolean) => {
      if (checked && !data.tts_id) {
        message.error(`Please set TTS model firstly. 
        Setting >> Model providers >> System model settings`);
        form.setFieldValue(['prompt_config', 'tts'], false);
      }
    },
    [data, form],
  );

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('upload', { keyPrefix: 'common' })}</div>
    </button>
  );

  return (
    <section
      className={classNames({
        [styles.segmentedHidden]: !show,
      })}
    >
      <Form.Item
        name={'name'}
        label={t('assistantName')}
        rules={[{ required: true, message: t('assistantNameMessage') }]}
      >
        <Input placeholder={t('namePlaceholder')} />
      </Form.Item>
      <Form.Item name={'description'} label={t('description')}>
        <Input placeholder={t('descriptionPlaceholder')} />
      </Form.Item>
      <Form.Item
        name="icon"
        label={t('assistantAvatar')}
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false}
          showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}
        >
          {show ? uploadButton : null}
        </Upload>
      </Form.Item>
      <Form.Item
        name={'language'}
        label={t('language')}
        initialValue={'English'}
        tooltip="coming soon"
        style={{ display: 'none' }}
      >
        <Select
          options={[
            { value: 'Chinese', label: t('chinese', { keyPrefix: 'common' }) },
            { value: 'English', label: t('english', { keyPrefix: 'common' }) },
          ]}
        />
      </Form.Item>
      <Form.Item name={'document_type'} label={t('documentType')}>
        <Select
          placeholder={t('selectDocumentType')}
          allowClear
          options={[
            { value: '', label: '' },
            { value: '10k', label: '10K' },
            { value: '10q', label: '10Q' },
          ]}
        />
      </Form.Item>
      <Form.Item name={'company_name'} label={t('companyName')}>
        <Input placeholder={t('enterCompanyName')} />
      </Form.Item>
      <Form.Item label={t('yearRange')}>
        <Space>
          <Form.Item name={'from_year'} noStyle>
            <Input placeholder={t('fromYear')} style={{ width: 120 }} />
          </Form.Item>
          <span>to</span>
          <Form.Item name={'to_year'} noStyle>
            <Input placeholder={t('toYear')} style={{ width: 120 }} />
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item
        name={emptyResponseField}
        label={t('emptyResponse')}
        tooltip={t('emptyResponseTip')}
      >
        <Input placeholder="" onChange={handleChange} />
      </Form.Item>
      <Form.Item
        name={['prompt_config', 'prologue']}
        label={t('setAnOpener')}
        tooltip={t('setAnOpenerTip')}
        initialValue={t('setAnOpenerInitial')}
      >
        <Input.TextArea autoSize={{ minRows: 5 }} />
      </Form.Item>
      <Form.Item
        label={t('quote')}
        valuePropName="checked"
        name={['prompt_config', 'quote']}
        tooltip={t('quoteTip')}
        initialValue={true}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label={t('keyword')}
        valuePropName="checked"
        name={['prompt_config', 'keyword']}
        tooltip={t('keywordTip')}
        initialValue={false}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label={t('tts')}
        valuePropName="checked"
        name={['prompt_config', 'tts']}
        tooltip={t('ttsTip')}
        initialValue={false}
      >
        <Switch onChange={handleTtsChange} />
      </Form.Item>
      <KnowledgeBaseItem
        required={false}
        onChange={handleChange}
      ></KnowledgeBaseItem>
    </section>
  );
};

export default AssistantSetting;
