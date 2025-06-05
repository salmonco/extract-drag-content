import { ReactElement, useEffect, useState } from 'react';

import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { createLazyFileRoute } from '@tanstack/react-router';

import { ChromeMessage, ChromeMessageType } from '@/common/chrome-api-wrapper';
import PopupContent from '@/popup/modules/core/components/PopupContent/PopupContent';
import PopupHeader from '@/popup/modules/core/components/PopupHeader/PopupHeader';

interface SelectedText {
    type: 'selection';
    content: string;
    pageTitle: string;
}

function HomePage(): ReactElement {
    const [selectedText, setSelectedText] = useState<SelectedText | null>(null);

    useEffect(() => {
        // 메시지 리스너 설정
        const messageListener = (message: ChromeMessage<SelectedText>) => {
            console.debug('Popup received message:', message);

            if (message.type !== ChromeMessageType.SCRAPING_RESULTS) {
                return false;
            }

            if (message.payload.type === 'selection') {
                setSelectedText(message.payload);
            }

            return false;
        };

        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return (
        <>
            <PopupHeader />
            <PopupContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Selected Text</Typography>

                    {selectedText ? (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                From: {selectedText.pageTitle}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 1,
                                    p: 2,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {selectedText.content}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography color="text.secondary">
                            Select text on the page to see it here
                        </Typography>
                    )}
                </Stack>
            </PopupContent>
        </>
    );
}

export const Route = createLazyFileRoute('/home-page/')({
    component: HomePage
});
