'use client'
import React, { useState } from 'react'

import { FileUpload } from './file-upload'

export default function FileUploadDemo() {
	const [files, setFiles] = useState<File[]>([])
	const handleFileUpload = (files: File[]) => {
		setFiles(files)
		console.log(files)
	}

	return (
		<div className="bg-card/80 border-border/50 mx-auto w-full max-w-4xl rounded-lg border backdrop-blur-md">
			<FileUpload onChange={handleFileUpload} />
		</div>
	)
}
