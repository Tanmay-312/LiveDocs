'use client';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode } from '@lexical/rich-text';
import { useThreads } from '@liveblocks/react/suspense';
import {
  liveblocksConfig,
  LiveblocksPlugin,
  FloatingComposer,
  useIsEditorReady,
  FloatingThreads,
} from '@liveblocks/react-lexical';

import { Loader } from '@/components/Loader';

import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import Theme from './Theme';
import { Comments } from '../Comments';
import { DeleteModal } from '../DeleteModal';

function Placeholder() {
  return <div className="editor-placeholder">Start writing here...</div>;
}

export function Editor({
  roomId,
  currentUserType,
}: {
  roomId: string;
  currentUserType: UserType;
}) {
  const { threads } = useThreads();

  const initialConfig = liveblocksConfig({
    namespace: 'Editor',
    nodes: [HeadingNode],
    onError: (error: unknown) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    editable: currentUserType === 'editor',
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <div className="toolbar-wrapper custom-scrollbar flex min-w-full justify-between">
          <ToolbarPlugin />
          {currentUserType === 'editor' && <DeleteModal roomId={roomId} />}
        </div>

        <LiveblocksPlugin>
          <EditorContent 
            currentUserType={currentUserType} 
            threads={threads} 
          />
        </LiveblocksPlugin>
      </div>
    </LexicalComposer>
  );
}

function EditorContent({ 
  currentUserType, 
  threads 
}: { 
  currentUserType: UserType; 
  threads: any;
}) {
  const isEditorReady = useIsEditorReady();

  return (
    <div className="editor-wrapper custom-scrollbar flex flex-col items-center justify-start">
      {!isEditorReady ? (
        <Loader />
      ) : (
        <div className="editor-inner relative mb-5 h-fit min-h-[1100px] w-full max-w-[800px] shadow-md lg:mb-10">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input h-full " />
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          {currentUserType === 'editor' && <FloatingToolbarPlugin />}
          <AutoFocusPlugin />
        </div>
      )}
      
      <FloatingComposer className="w-[350px]" />
      <Comments />
      <FloatingThreads threads={threads} className="top-20 block" />
    </div>
  );
}