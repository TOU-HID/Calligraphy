/**
 * Template Selector Modal
 * 
 * Modal for selecting and creating canvases from templates
 */

import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';
import { GlassCard } from '@shared/components/GlassCard';
import { TemplateCard } from './TemplateCard';
import { TemplateService } from '../services/TemplateService';

interface TemplateSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string, name: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  visible,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [canvasName, setCanvasName] = useState('');
  const templates = TemplateService.getAllTemplates();

  const handleCreate = (): void => {
    if (!selectedTemplateId) return;

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
    const finalName = canvasName.trim() || selectedTemplate?.name || 'New Canvas';

    onSelectTemplate(selectedTemplateId, finalName);
    setSelectedTemplateId(null);
    setCanvasName('');
    onClose();
  };

  const handleClose = (): void => {
    setSelectedTemplateId(null);
    setCanvasName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable onPress={(e) => e.stopPropagation()} style={styles.modal}>
          <GlassCard blurAmount="strong" blurType="dark">
            <View style={styles.container}>
              <Text style={styles.title}>Choose a Template</Text>
              <Text style={styles.subtitle}>
                Select a template to start your new canvas
              </Text>

              <FlatList<{
                id: string;
                name: string;
                description: string;
                thumbnail: string;
              }>
                data={templates}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TemplateCard
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    thumbnail={item.thumbnail}
                    isSelected={selectedTemplateId === item.id}
                    onPress={setSelectedTemplateId}
                  />
                )}
              />

              {selectedTemplateId && (
                <>
                  <Text style={styles.inputLabel}>Canvas Name (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter canvas name..."
                    placeholderTextColor={colors.textSecondary}
                    value={canvasName}
                    onChangeText={setCanvasName}
                  />
                </>
              )}

              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={handleClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[styles.createButton, !selectedTemplateId && styles.createButtonDisabled]}
                  onPress={handleCreate}
                  disabled={!selectedTemplateId}
                >
                  <Text style={styles.createButtonText}>Create Canvas</Text>
                </Pressable>
              </View>
            </View>
          </GlassCard>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  container: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },
});
