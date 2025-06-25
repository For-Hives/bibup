'use client'
import React, { useState } from 'react'

import { FileUpload } from './file-upload'

export default function FileUploadDemo() {
	const [, setFiles] = useState<File[]>([])
	const handleFileUpload = (files: File[]) => {
		setFiles(files)
		// Handle file upload logic here
	}

	return (
		<div className="bg-card/80 border-border/50 mx-auto w-full max-w-4xl rounded-lg border backdrop-blur-md">
			<FileUpload locale="en" onChange={handleFileUpload} />
			{/*  TODO: si le component Demo est toujours utiliser, mettre les locales en mode dynamique */}
		</div>
	)
}
