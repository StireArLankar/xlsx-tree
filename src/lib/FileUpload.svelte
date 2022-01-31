<script lang="ts">
  export let onFileUpload

  let ref

  const SheetJSFT = [
    'xlsx',
    'xlsb',
    'xlsm',
    'xls',
    'xml',
    'csv',
    'txt',
    'ods',
    'fods',
    'uos',
    'sylk',
    'dif',
    'dbf',
    'prn',
    'qpw',
    '123',
    'wb*',
    'wq*',
    'html',
    'htm',
  ]
    .map((x) => `.${x}`)
    .join(',')

  const handleChange = async (e: any) => {
    const files = e.target.files
    const { handleFile } = await import('../xls')
    if (files && files[0]) {
      handleFile(files[0]).then(onFileUpload)
    }
  }

  const onClick = () => {
    ref?.click()
  }
</script>

<form on:submit={(e) => e.preventDefault()}>
  <button on:click={onClick}>
    Drag or choose a spreadsheet file
    <input
      type="file"
      id="file"
      accept={SheetJSFT}
      on:change={handleChange}
      style="display: none"
      bind:this={ref}
    />
  </button>
</form>
