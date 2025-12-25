import React, { useState } from "react";
import { Button, Modal, Form, InputNumber, Checkbox, message, Row, Col } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { ChatMultiSelect } from "components/Form/ChatMultiSelect";
import { DateRangeFilter } from "components/Form/DateRangeFilter";
import { useTriggerNgramGeneration } from "../api/triggerNgramGeneration";

export const TriggerNgramButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const triggerMutation = useTriggerNgramGeneration({
    config: {
      onSuccess: () => {
        message.success("N-gram generation started successfully");
        setIsModalVisible(false);
        form.resetFields();
        setSelectAll(true);
        setSelectedChatIds([]);
        setDateFrom(undefined);
        setDateTo(undefined);

        // Invalidate queries to refresh status
        queryClient.invalidateQueries({ queryKey: ["processing-status"] });
      },
      onError: (error: any) => {
        message.error(`Failed to start n-gram generation: ${error.message}`);
      },
    },
  });

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        triggerMutation.mutate({
          chat_ids: selectAll ? undefined : selectedChatIds,
          date_from: dateFrom,
          date_to: dateTo,
          n_values: values.n_values || [2, 3],
          min_frequency: values.min_frequency || 5,
          exclude_stopwords: values.exclude_stopwords !== false,
          stopwords_language: values.stopwords_language || "german",
        });
      })
      .catch((error: any) => {
        console.error("Form validation failed:", error);
      });
  };

  return (
    <>
      <Button
        type="primary"
        icon={<BarChartOutlined />}
        onClick={() => setIsModalVisible(true)}
      >
        Generate N-grams
      </Button>

      <Modal
        title="Generate N-grams"
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={triggerMutation.isPending}
        width={600}
        okText="Generate"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Select Chats">
            <ChatMultiSelect
              selectedChatIds={selectedChatIds}
              onSelectionChange={setSelectedChatIds}
              selectAll={selectAll}
              onSelectAllChange={setSelectAll}
            />
          </Form.Item>

          <Form.Item label="Date Range (Optional)">
            <DateRangeFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              onChange={(from, to) => {
                setDateFrom(from);
                setDateTo(to);
              }}
            />
          </Form.Item>

          <Form.Item
            label="N-gram Sizes"
            name="n_values"
            initialValue={[2, 3]}
            rules={[
              {
                required: true,
                message: "Please select at least one n-gram size",
              },
            ]}
          >
            <Checkbox.Group
              options={[
                { label: "Unigrams (1)", value: 1 },
                { label: "Bigrams (2)", value: 2 },
                { label: "Trigrams (3)", value: 3 },
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Minimum Frequency"
                name="min_frequency"
                initialValue={5}
                rules={[
                  {
                    required: true,
                    message: "Please enter minimum frequency",
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  max={1000}
                  style={{ width: "100%" }}
                  placeholder="Minimum frequency"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Stopwords Language"
                name="stopwords_language"
                initialValue="german"
              >
                <Checkbox.Group
                  options={[
                    { label: "German", value: "german" },
                    { label: "English", value: "english" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="exclude_stopwords"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox>Exclude stopwords</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
