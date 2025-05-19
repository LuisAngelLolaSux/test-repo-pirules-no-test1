import * as React from 'react';
import { Html, Tailwind, Container, Head, Font } from '@react-email/components';

interface IBaseEmailProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function BaseEmail({ children, footer }: IBaseEmailProps) {
    return (
        <Tailwind>
            <Html lang="en">
                <Head>
                    <Font
                        fontFamily="Poppins"
                        fallbackFontFamily="Verdana"
                        webFont={{
                            url: 'https://fonts.gstatic.com/s/poppins/v22/pxiAyp8kv8JHgFVrJJLmE0tMMPKhSkFEkm8.woff2',
                            format: 'woff2',
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />
                </Head>
                <div className="w-full flex-col items-center justify-center bg-[#FAFAFA] text-center sm:py-8">
                    <Container>
                        <Container className="w-fit rounded-xl border border-gray-300 bg-white text-black sm:p-8 sm:pb-0">
                            {children}
                        </Container>
                        <div>{footer}</div>
                    </Container>
                </div>
            </Html>
        </Tailwind>
    );
}

export default BaseEmail;
