import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutPageSkeleton() {
    return (
        <div className="h-screen bg-[#FAFAFA]">
            <div className="mx-auto w-full max-w-6xl space-y-4 p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                    {/* Left column with two containers */}
                    <div className="flex-1 bg-white">
                        {/* Top left container */}
                        <div className="flex flex-col rounded-lg p-4">
                            <div className="mb-10 flex w-full items-center justify-between">
                                <Skeleton className="h-6 w-32 rounded-full" />
                                <Skeleton className="h-6 w-64 rounded-full" />
                            </div>
                            <div className="flex w-full flex-col space-y-3">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <Skeleton className="my-5 h-6 w-36" />
                            <div className="flex w-full flex-col space-y-3">
                                <Skeleton className="h-14 w-[95%]" />
                                <Skeleton className="h-14 w-[95%]" />
                                <Skeleton className="h-14 w-[95%]" />
                            </div>
                        </div>
                    </div>

                    {/* Right column - four containers */}
                    <div className="space-y-1 md:w-1/3">
                        {/* First right container */}
                        <div className="space-y-3 rounded-t-lg bg-white p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-1/4 rounded-full" />
                                    <Skeleton className="h-4 w-3/4 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Second right container */}
                        <div className="space-y-3 bg-white p-4 px-10">
                            <Skeleton className="h-10 w-full rounded-full" />
                        </div>

                        {/* Third right container */}
                        <div className="space-y-3 bg-white p-4 px-10">
                            <Skeleton className="h-10 w-full rounded-full" />
                        </div>

                        {/* Fourth right container */}
                        <div className="space-y-3 rounded-b-lg bg-white p-4">
                            <Skeleton className="h-4 w-[45%] rounded-full" />
                            <Skeleton className="h-10 w-full rounded-full" />
                            <Skeleton className="h-10 w-full rounded-full" />
                            <Skeleton className="h-10 w-full rounded-full" />
                            <hr />
                            <Skeleton className="h-10 w-full rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <div className="mt-4 space-y-3 rounded-lg bg-white p-4">
                            <Skeleton className="h-6 w-10 rounded-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                        <Skeleton className="mt-4 h-8 w-full" />
                    </div>
                    <div className="md:w-1/3"></div>
                </div>
            </div>
        </div>
    );
}
