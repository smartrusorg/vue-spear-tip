<template lang="pug">
  .vst-field-editor(
    class="w100% h100% overflow-hidden"
    :class=`{
      'bg-white b-solid b-1px b-stone rounded-3xl': !disabled,
    }`
    ref="vstFieldEditor"
    :data-simplebar-auto-hide="!disabled ? 'true' : 'false'"
  )
    div(
      class="pos-sticky top-5px pr-10px flex justify-end h-0 z-999 pointer-events-none"
      v-if="!disabled && value"
      :class=`{
         // 't-15px': maskPreset == 'datetime' || maskPreset == 'datetimeSec',
         // 't-9px': maskPreset != 'datetime' && maskPreset != 'datetimeSec',
      }`
    )
      div(class="text-stone w25px z999")
        NoSymbolIcon.vst-text-field-reset(v-if="!preResetValue" class="pointer-events-auto cursor-pointer hover:scale-130")
        svg(
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w25px h25px text-teal-500 absolute r-12px z4 cursor-pointer hover:scale-13 pointer-events-auto cursor-pointer hover:scale-130"
          @click="restoreValue"
        )
          path(stroke="none" d="M0 0h24v24H0z" fill="none")
          path(d="M9 14l-4 -4l4 -4")
          path(d="M5 10h11a4 4 0 1 1 0 8h-1")


    mixin additionalButtons()
      // РЕДАКТИРОВАНИЕ ССЫЛКИ
      div(class="w100%")
        div(
          v-if="(isEditorLinkActive || showLinkModal) && bubbleMenuPlacementY"
          class="flex justify-center items-center gap-5px p-5px bg-white/80 rounded-xl shadow-sm shadow-blue/30"
          :class=`{
            'mt10px': bubbleMenuPlacementY == 'bottom',
            'mb6px': bubbleMenuPlacementY == 'top',
          }`
        )
          div(class="flex gap-2px justify-center")
            // Поле ввода URL
            VSTStringField(
              :inputValue="linkUrl"
              v-model="linkUrl"
              placeholder="URL (https://...)"
              class="w200px!"
              @mousedown.stop
              @touchstart.stop
              @keypress.enter="addLink"
              size="md"
              ref="linkUrlInput"
            )
            //// Чекбокс для target="_blank"
            //label(class="flex items-center text-12px cursor-pointer")
            //  input(type="checkbox" class="mr-5px")
            //  span Открывать в новом окне

          div(class="flex items-center ml-5px")
            // Кнопка Сохранить/Изменить
            VSTButton(theme="empty" @clickTap="addLink" size="md" :disabled="!linkUrl")
              span(
                :class=`{
                  'text-blue-700/80': isEditorLinkActive,
                  'text-#6a69b5/90': !isEditorLinkActive,
                }`
              )
                svg(
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon icon-tabler icons-tabler-outline icon-tabler-link-plus"
                )
                  path(stroke="none" d="M0 0h24v24H0z" fill="none")
                  path(d="M9 15l6 -6")
                  path(d="M11 6l.463 -.536a5 5 0 0 1 7.072 0a4.993 4.993 0 0 1 -.001 7.072")
                  path(d="M12.603 18.534a5.07 5.07 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463")
                  path(d="M16 19h6")
                  path(d="M19 16v6")
            // Кнопка Удалить
            VSTButton(v-if="isEditorLinkActive" theme="empty" @clickTap="removeLink" size="sm")
              span(class="text-red-600/80")
                svg(
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="icon icon-tabler icons-tabler-filled icon-tabler-trash-x"
                )
                  path(stroke="none" d="M0 0h24v24H0z" fill="none")
                  path(
                    d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z"
                  )
                  path(
                    d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
                  )


        // Курсор внутри таблицы
        div(
          v-if="isEditTable"
          class=`flex items-center justify-center gap-2px bg-white p-5px rounded-xl shadow-lg border-1
            border-stone`
          :class=`{
            'mb7px': bubbleMenuPlacementY == 'top',
            'mt12px': bubbleMenuPlacementY == 'bottom',
          }`
        )
          // Добавить столбец
          VSTButton(size="sm" theme="empty" @clickTap="editor.chain().focus().addColumnAfter().run()")
            span(class="relative mt-0 flex items-center")
              svg(
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#3165C4FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-table-column"
              )
                path(stroke="none", d="M0 0h24v24H0z", fill="none")
                path(d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14")
                path(d="M10 10h11")
                path(d="M10 3v18")
                path(d="M9 3l-6 6")
                path(d="M10 7l-7 7")
                path(d="M10 12l-7 7")
                path(d="M10 17l-4 4")

          // Добавить строку
          VSTButton(size="sm" theme="empty" @clickTap="editor.chain().focus().addRowAfter().run()")
            span(class="relative mt-0 flex items-center")
              svg(
                xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewbox='0 0 24 24'
                fill='none' stroke='#3165c4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
              )
                path(stroke='none' d='M0 0h24v24H0z' fill='none')
                path(d='M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14')
                path(d='M9 3l-6 6')
                path(d='M14 3l-7 7')
                path(d='M19 3l-7 7')
                path(d='M21 6l-4 4')
                path(d='M3 10h18')
                path(d='M10 10v11')

          // Удалить столбец
          VSTButton(size="sm" theme="empty" @clickTap="editor.chain().focus().deleteColumn().run()")
            span(class="relative mt-0 flex items-center")
              svg(
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="#f1415b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-table-column"
              )
                path(stroke="none", d="M0 0h24v24H0z", fill="none")
                path(d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14")
                path(d="M10 10h11")
                path(d="M10 3v18")
                path(d="M9 3l-6 6")
                path(d="M10 7l-7 7")
                path(d="M10 12l-7 7")
                path(d="M10 17l-4 4")

          // Удалить строку
          VSTButton(size="sm" theme="empty" @clickTap="editor.chain().focus().deleteRow().run()")
            span(class="relative mt-0 flex items-center")
              svg(
                xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewbox='0 0 24 24'
                fill='none' stroke='#f1415b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'
              )
                path(stroke='none' d='M0 0h24v24H0z' fill='none')
                path(d='M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14')
                path(d='M9 3l-6 6')
                path(d='M14 3l-7 7')
                path(d='M19 3l-7 7')
                path(d='M21 6l-4 4')
                path(d='M3 10h18')
                path(d='M10 10v11')

          VSTButton(size="sm" theme="empty" @clickTap="editor.chain().focus().deleteTable().run()")
            div(class="mt-0 flex items-center")
              svg(
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="#f1415b"
                stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M12.5 21h-7.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10")
                path(d="M3 10h18")
                path(d="M10 3v18")
                path(d="M16 19h6")


    mixin closeButton()
      VSTButton(
        size="sm"
        theme="empty"
        @clickTap="showMenu = false"
        :theme="editor.isActive('orderedList') ? activeButtonsTheme : defaultButtonsTheme"
      )
        span(class="text-stone!")
          svg(
            data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="24" height="24"
          )
            path(
              stroke-linecap="round" stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            )

    BubbleMenu.bubble-menu-top(
      v-if="editor && showMenu && markdownEnabled"
      :editor
      :options=`{
        placement: 'top-center',
        appendTo: 'parent',
        flip: true,
        padding: 100,
        offset: [100, 0],
        fallbackPlacements: ['bottom'],
      }`
      :shouldShow="shouldBubbleMenuShow"
      @mousedown.prevent
      @touchstart.prevent
      :class=`{
        'mt-4px!' : bubbleMenuPlacementY == 'bottom' && !isEditTable,
        'mt--4px!' : bubbleMenuPlacementY == 'top' && !isEditTable,
        'mt-8px!' : bubbleMenuPlacementY == 'bottom' && isEditTable,
        'mt--8px!' : bubbleMenuPlacementY == 'top' && isEditTable,
        'visibility-hidden': !enabledTableRowsShowEditorButtons,
      }`
    )
      template(v-if="bubbleMenuPlacementY == 'top'")
        +additionalButtons
      // ОБЫЧНОЕ ТЕКСТОВОЕ МЕНЮ
      div(
        class="bubble-menu"
        :class=`{
          'flex! flex-col-reverse!': bubbleMenuPlacementY == 'top',
        }`
      )
        div(class="flex items-center justify-center w100%")
          VSTButton(
            size="md"
            :theme="editor.isActive('bold') ? activeButtonsTheme : defaultButtonsTheme"
            @clickTap="editor.chain().focus().toggleBold().run()"
            @keypress.enter="editor.chain().focus().toggleBold().run()"
            @mousedown.stop
            @touchstart.stop
          )
            div(
              class="mt-0 flex items-center"
              :class="{ 'fw-bold': editor.isActive('bold') }"
            ) B
          VSTButton(
            size="md"
            :theme="editor.isActive('italic') ? activeButtonsTheme : defaultButtonsTheme"
            @clickTap="editor.chain().focus().toggleItalic().run()"
            @keypress.enter="editor.chain().focus().toggleItalic().run()"
            @mousedown.stop
            @touchstart.stop
          )
            div(
              class="mt-0 flex items-center"
              :class="{ 'italic': editor.isActive('italic') }"
            ) I
          VSTButton(
            size="md"
            :theme="editor.isActive('underline') ? activeButtonsTheme : defaultButtonsTheme"
            @clickTap="editor.chain().focus().toggleUnderline().run()"
            @keypress.enter="editor.chain().focus().toggleUnderline().run()"
            @mousedown.stop
            @touchstart.stop
          )
            div(
              class="mt-0 flex items-center"
              :class="{ 'underline': editor.isActive('underline') }"
            ) U
          VSTButton(
            size="md"
            :theme="editor.isActive('strike') ? activeButtonsTheme : defaultButtonsTheme"
            @clickTap="editor.chain().focus().toggleStrike().run()"
            @keypress.enter="editor.chain().focus().toggleStrike().run()"
            class="p-0"
            @mousedown.stop
            @touchstart.stop
          )
            div(
              class="mt-0 flex items-center"
              :class="{ 'italic': editor.isActive('strike') }"
              :style=`{
                textDecoration: editor.isActive('strike') ? 'line-through' : undefined,
                textDecorationColor: editor.isActive('strike') ? '#fff' : undefined,
                // textDecorationThickness: editor.isActive('strike') ? '3px' : undefined,
              }`
            ) S

          // Кнопка добавления ссылки
          VSTButton(
            v-if="!isAtEmptyLine"
            size="md"
            :theme="isEditorLinkActive ? activeButtonsTheme : defaultButtonsTheme"
            :class="{ 'fw-bold!': isEditorLinkActive, 'text-white! fill-white! stroke-white!': true, }"
            @clickTap="openLinkCreateBlock"
            @keypress.enter="openLinkCreateBlock"
            @mousedown.stop
            @touchstart.stop
          )
            div(class="mt-0 flex items-center")
              svg(
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-link"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M9 15l6 -6")
                path(d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464")
                path(d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463")
          template(v-else)
            +closeButton


        div(class="flex items-center my4px justify-center w100%")
          // Добавляем кнопки для списков
          VSTButton(
            size="md"
            :theme="editor.isActive('bulletList') ? activeButtonsTheme : defaultButtonsTheme"
            @clickTap="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'fw-bold!': editor.isActive('bulletList') }"
          )
            div(class="mt-0 flex items-center")
              svg(
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-list fs-1rem"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M9 6l11 0")
                path(d="M9 12l11 0")
                path(d="M9 18l11 0")
                path(d="M5 6l0 .01")
                path(d="M5 12l0 .01")
                path(d="M5 18l0 .01")
          VSTButton(
            size="md"
            :theme="editor.isActive('orderedList') ? activeButtonsTheme : defaultButtonsTheme"
            @clickTap="editor.chain().focus().toggleOrderedList().run()"
            @keypress.enter="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'fw-bold!': editor.isActive('orderedList'), 'text-white! fill-white! stroke-white!': true, }"
          )
            div(class="mt-0 flex items-center")
              svg(xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-list-numbers fs-1rem"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M11 6h9" stroke="currentColor" fill="none")
                path(d="M11 12h9" stroke="currentColor" fill="none")
                path(d="M12 18h8" stroke="currentColor" fill="none")
                path(d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" stroke="currentColor" fill="none")
                path(d="M6 10v-6l-2 2" stroke="currentColor" fill="none")
          // Кнопка чекбокс-список
          VSTButton(
            :theme="editor.isActive('taskList') ? activeButtonsTheme : defaultButtonsTheme"
            :class="{ 'fw-bold!': editor.isActive('taskList'), 'text-white! fill-white! stroke-white!': true, }"
            @clickTap="editor.chain().focus().toggleTaskList().run()"
            @keypress.enter="editor.chain().focus().toggleTaskList().run()"
            size="md"
            @mousedown.stop
            @touchstart.stop
          )
            div(class="mt-0 flex items-center")
              svg(
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
                path(stroke="none" d="M0 0h24v24H0z" fill="none")
                path(d="M3.5 5.5l1.5 1.5l2.5 -2.5")
                path(d="M3.5 11.5l1.5 1.5l2.5 -2.5")
                path(d="M3.5 17.5l1.5 1.5l2.5 -2.5")
                path(d="M11 6l9 0")
                path(d="M11 12l9 0")
                path(d="M11 18l9 0")
          // Кнопка создания таблицы
          VSTButton(
            size="md"
            :theme="defaultButtonsTheme"
            @clickTap="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
            @keypress.enter="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
            title="Вставить таблицу 3x3"
          )
            // Можно использовать иконку из Heroicons или просто текст
            div(class="fs-12px fw-bold text-white! flex items-center")
              svg(
                height="25"
                data-slot="icon"
                stroke-width="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              )
                path(stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5")


        div(v-if="isSelectingImageResized" class="flex items-center justify-center mb5px w100%")
          VSTButton(
            size="md"
            theme="white"
            class="w100%"
            @clickTap="resetImageSize"
            title="Вернуть исходный размер"
          )
            // Иконка или текст, например "Original Size"
            div(class="fs-1rem px-5px") 1:1


        div(class="flex items-center justify-center w100% my2px")
          VSTButton(
            size="md"
            @clickTap="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          )
            div(class="mt-0 flex items-center") H1
          VSTButton(
            size="md"
            @clickTap="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          )
            div(class="mt-0 flex items-center") H2
          VSTButton(
            size="md"
            @clickTap="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          )
            div(class="mt-0 flex items-center") H3
          VSTButton(
            size="md"
            @clickTap="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
          )
            div(class="mt-0 flex items-center") H4
          template(v-if="!isAtEmptyLine && isEditorLinkActive")
            +closeButton


      template(v-if="bubbleMenuPlacementY == 'bottom'")
        +additionalButtons

    // НЕПОСРЕДСТВЕННО РЕДАКТОР
    EditorContent(:editor="editor" @clickTap="clickEditor")


    // КОЛИЧЕСТВО СИМВОЛОВ И ЛИМИТ
    div(
      v-if="!disabled"
      class="pos-sticky bottom-6px p0! text-stone/80 ml-100% w100%"
      :class=`{
        // Ручное распределение, возможно придумать что-то получше
        'translate-x--4%!': !limit && charactersCountLength == 1,
        'translate-x--5%!': !limit && charactersCountLength == 2,
        'translate-x--6%!': !limit && charactersCountLength == 3,
        'translate-x--7%': !limit && charactersCountLength == 4,
        'translate-x--8%': !limit && charactersCountLength == 5
          || (limitCountLength == 1 && charactersCountLength == 1),
        'translate-x--9%': !limit && charactersCountLength == 6
          || (limitCountLength == 1 && charactersCountLength == 2)
          || (limitCountLength == 2 && charactersCountLength == 1),
        'translate-x--10%': !limit && charactersCountLength == 7
          || (limitCountLength == 1 && charactersCountLength == 3)
          || (limitCountLength == 2 && charactersCountLength == 2)
          || (limitCountLength == 3 && charactersCountLength == 1),
        'translate-x--11%': !limit && charactersCountLength == 8
          || (limitCountLength == 1 && charactersCountLength == 4)
          || (limitCountLength == 2 && charactersCountLength == 3)
          || (limitCountLength == 3 && charactersCountLength == 2)
          || (limitCountLength == 4 && charactersCountLength == 1),
        'translate-x--12%': !limit && charactersCountLength == 9
          || limit && (
            (limitCountLength == 1 && charactersCountLength == 5)
            || (limitCountLength == 2 && charactersCountLength == 4)
            || (limitCountLength == 3 && charactersCountLength == 3)
            || (limitCountLength == 4 && charactersCountLength == 2)
            || (limitCountLength == 5 && charactersCountLength == 1)
          ),
        'translate-x--13%': !limit && charactersCountLength == 10
          || (limit && (
            (limitCountLength == 1 && charactersCountLength == 6)
            || (limitCountLength == 2 && charactersCountLength == 5)
            || (limitCountLength == 3 && charactersCountLength == 4)
            || (limitCountLength == 4 && charactersCountLength == 3)
            || (limitCountLength == 5 && charactersCountLength == 2)
            || (limitCountLength == 6 && charactersCountLength == 1)
          )),
        'translate-x--14%': !limit && charactersCountLength == 11
          || (limit && (
            (limitCountLength == 1 && charactersCountLength == 7)
            || (limitCountLength == 2 && charactersCountLength == 6)
            || (limitCountLength == 3 && charactersCountLength == 5)
            || (limitCountLength == 4 && charactersCountLength == 4)
            || (limitCountLength == 5 && charactersCountLength == 3)
            || (limitCountLength == 6 && charactersCountLength == 2)
            || (limitCountLength == 7 && charactersCountLength == 1)
          )),
        'translate-x--15%': !limit && charactersCountLength == 12
          || (limit && (
            (limitCountLength == 1 && charactersCountLength == 8)
            || (limitCountLength == 2 && charactersCountLength == 7)
            || (limitCountLength == 3 && charactersCountLength == 6)
            || (limitCountLength == 4 && charactersCountLength == 5)
            || (limitCountLength == 5 && charactersCountLength == 4)
            || (limitCountLength == 6 && charactersCountLength == 3)
            || (limitCountLength == 7 && charactersCountLength == 2)
            || (limitCountLength == 8 && charactersCountLength == 1)
        )),
        'translate-x--17%': !limit && charactersCountLength == 13
          || (limit && (
            (limitCountLength == 1 && charactersCountLength == 9)
            || (limitCountLength == 2 && charactersCountLength == 8)
            || (limitCountLength == 3 && charactersCountLength == 7)
            || (limitCountLength == 4 && charactersCountLength == 6)
            || (limitCountLength == 5 && charactersCountLength == 5)
            || (limitCountLength == 6 && charactersCountLength == 4)
            || (limitCountLength == 7 && charactersCountLength == 3)
            || (limitCountLength == 8 && charactersCountLength == 2)
            || (limitCountLength == 9 && charactersCountLength == 1)
          )),
        'translate-x--18%': !limit && charactersCountLength == 14
          || (limit && (
            (limitCountLength == 1 && charactersCountLength == 10)
            || (limitCountLength == 2 && charactersCountLength == 9)
            || (limitCountLength == 3 && charactersCountLength == 8)
            || (limitCountLength == 4 && charactersCountLength == 7)
            || (limitCountLength == 5 && charactersCountLength == 6)
            || (limitCountLength == 6 && charactersCountLength == 5)
            || (limitCountLength == 7 && charactersCountLength == 4)
            || (limitCountLength == 8 && charactersCountLength == 3)
            || (limitCountLength == 9 && charactersCountLength == 2)
            || (limitCountLength == 10 && charactersCountLength == 1)
          )),
      }`
    )
      span(
        class="bg-white/90 rounded-3xl px4px"
      )
        span(
          :class=`{
            'text-red/90 fw-bold': limit && charactersCount >= limit
          }`
        ) {{ charactersCount }}
        span(
          v-if="limit"
          :class=`{
            'text-red/90 fw-bold': charactersCount >= limit
          }`
        ) &nbsp;/&nbsp;
        span(
          v-if="limit"
          :class=`{
            'text-red/90 fw-bold': charactersCount >= limit
          }`
        ) {{ limit }}
</template>

<script lang="ts">
import { findParentNode, posToDOMRect, InputRule } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { Editor, EditorContent } from '@tiptap/vue-3' // @ts-ignore
import { BubbleMenu } from '@tiptap/vue-3/menus'
import {VST, Watch, Prop, BaseComponentEventInput} from '../../../core'
import {default as VSTButton} from '../../Elements/Button'
import {default as VSTButtonOrig} from '../../Elements/Button/Button.vue'
import {default as VSTStringField} from '../StringField'
import {default as VSTScrollbar} from '../../Elements/Scrollbar'
import FieldComponent from '../../../replaceable/FieldComponent.vue'
import { Markdown } from 'tiptap-markdown'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { NoSymbolIcon } from '@heroicons/vue/20/solid'
import {Table} from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import SimpleBar from 'simplebar'

@VST export default class TextField extends FieldComponent {
  components = {
    EditorContent,
    BubbleMenu,
    VSTButton,
    VSTStringField,
    VSTScrollbar,
    NoSymbolIcon,
  }
  @Prop(String) readonly outputFormat: 'markdown'|'html' = 'markdown'
  @Prop(String) readonly defaultButtonsTheme: string = 'pink'
  @Prop(String) readonly activeButtonsTheme: string = 'purple'
  @Prop(String) readonly placeholder: string = ''
  @Prop(Boolean) readonly linksEnabled: boolean = true
  @Prop(Boolean) readonly markdownEnabled: boolean = true
  @Prop(Boolean) readonly imagesEnabled: boolean = true

  /** Trim spaces after words with selection */
  @Prop(Boolean) readonly stickyWordSelection: boolean = true
  @Prop(Number) readonly limit: number = 0
  @Prop(Function) readonly onImageUpload?: (file: File | string) => Promise<string>

  declare $refs: {
    linkUrlInput: VSTButtonOrig
    vstFieldEditor: HTMLDivElement & {sbInstance?: typeof SimpleBar}
  }

  editor: any|(typeof Editor) = undefined
  isEditable: boolean = true
  showMenu: boolean = true
  loading: boolean = true
  vstTextId: string = ''
  showLinkModal: boolean = false
  preResetValue: string = ''
  linkUrl: string = ''
  beforeMount() {
    this.vstTextId = `vst-text-field-${this.VST.generateRandomKey()}`
  }

  isFromEditorValueChanged: boolean = false
  enabledTableRowsShowEditorButtons: boolean = true
  showAdditionalButtons: boolean = true
  bubbleMenuPlacementY: 'top'|'bottom'|null = null

  mounted() {
    this.registerReactiveEvent('tap', '.vst-text-field-reset', this.resetValue)
    this.value = (this.inputValue || this.modelValue || '')

    this.editor = new Editor({
      editable: !this.disabled,
      // Срабатывает при любом изменении текста/форматирования
      onUpdate: ({ editor }) => {
        // Получаем контент в нужном формате
        const output = (
          (this.outputFormat === 'markdown' && this.markdownEnabled // @ts-ignore
            ? editor?.storage?.markdown?.getMarkdown?.()
            : this.markdownEnabled ? editor?.getHTML?.() : editor?.getText?.())
          || ''
        ).trim()

        editor.state.doc.descendants(node => {
          if (node.type.name === 'image') {
            this.editor.commands.updateAttributes('image', node.attrs)
          }
        })


        this.$emit('update:modelValue', output)
        if (output) {
          this.isFromEditorValueChanged = true
          this.value = output?.toString?.() // Синхронизируем внутреннее состояние
        }
        this.nextTick(() => {
          if (this.$refs.vstFieldEditor?.sbInstance) {
            this.$refs.vstFieldEditor.sbInstance.recalculate()
          }
        })
      },
      editorProps: {
        // Перехват вставки из буфера (Ctrl+V)
        handlePaste: (view, event) => {
          return this.handleImageUpload(event)
        },
        // Перехват перетаскивания (Drag-and-Drop)
        handleDrop: (view, event) => {
          return this.handleImageUpload(event)
        },
        handleDOMEvents: {
          mouseup: (view) => {
            if (!this.stickyWordSelection) return true
            const { state } = view
            const { from, to, empty } = state.selection

            if (empty) return false

            // Получаем текст внутри текущего выделения
            const selectedText = state.doc.textBetween(from, to, " ")

            // Считаем пробелы в начале и в конце
            const startSpaces = selectedText.length - selectedText.trimStart().length
            const endSpaces = selectedText.length - selectedText.trimEnd().length

            // Если пробелы есть, пересчитываем границы
            if (startSpaces > 0 || endSpaces > 0) {
              const newFrom = from + startSpaces
              const newTo = to - endSpaces

              // Проверка на корректность границ, чтобы не вызвать Range Error
              if (newFrom < newTo) {
                this.editor.chain()
                    .setTextSelection({ from: newFrom, to: newTo })
                    .run()

                return true // Прерываем стандартное событие
              }
            }
            return false
          }
        }
      },
      onSelectionUpdate: () => {
        // Если мы НЕ на ссылке, закрываем режим редактирования ссылки
        if (!this.isEditorLinkActive) {
          this.showLinkModal = false
        }
      },
      extensions: [
        ...[
          StarterKit.configure({
            // Если StarterKit вашей версии включает Link
            link: !this.linksEnabled ? false : {
              openOnClick: false,
              HTMLAttributes: {
                rel: 'noopener noreferrer',
                target: null, // Позволяет управлять атрибутом вручную
              },
              autolink: false,
              defaultProtocol: 'https',
            },
          }),
          CharacterCount.configure({
            limit: this.limit ? this.limit : 0, // Опционально: жесткий лимит
            mode: 'textSize',
          }),
          Placeholder.configure({
            placeholder: this.placeholder ? this.placeholder : `Поле для ввода${
              this.markdownEnabled ? ' форматированного' : ''
            } текста`,
          }),
          Table.configure({
            resizable: true, // Таблицы тоже можно будет ресайзить!
          }),
          TableRow,
          TableHeader,
          TableCell,
          TaskList,
          TaskItem.configure({
            nested: true, // Позволяет вложенные чекбоксы
          }),
        ],

        // Markdown разметка
        ...(!this.markdownEnabled ? [] : [Markdown.configure({
            html: true,
            breaks: true,
            linkify: this.linksEnabled,
            transformPastedText: true,
            transformCopiedText: this.outputFormat === 'markdown',
            // Включаем трансформацию при копировании в Markdown
            // transformCopiedText: (text) => {
            //   // Используем геттер Markdown для буфера обмена
            //   return this.outputFormat === 'markdown' ? this.editor?.storage.markdown.getMarkdown() : text
            // },
          })]),

        // Изображения
        ...(!this.imagesEnabled ? [] : [
          Image.extend({
            addInputRules() {
              return [
                new InputRule({
                  // Регулярка ловит: ![alt](url 100x200) или ![alt](url 100)
                  find: /!\[(.+|)\]\((\S+)(?:(?:\s+)(\d+)?(?:x(\d+))?)?\)\s$/,
                  handler: ({ state, range, match }) => {
                    const [, alt, src, width, height] = match
                    if (src) {
                      // Используем команду setImage, если она есть, или создаем ноду напрямую через схему
                      state.tr.replaceWith(range.from, range.to, this.type.create({
                        src: src, // Убедитесь, что здесь не undefined
                        alt: alt || null,
                        width: width || null,
                        height: height || null
                      }))
                    }
                  },
                }),
              ]
            },
            // Принудительно заставляем Markdown-плагин их видеть
            addStorage() {
              return {
                ...this.parent?.(),
                markdown: {
                  serialize: (state: any, node: any) => {
                    const { src, alt, title, width, height } = node.attrs


                    // Если юзер изменил размер — выводим HTML <img>
                    if (width || height) {
                      let attrs = `src="${src}"`
                      if (alt) attrs += ` alt="${
                        typeof state.esc === 'function'
                          ? state.esc(alt || '')
                          : (alt || '')
                      }"`
                      if (title) attrs += ` title="${
                        title
                          ? ` "${typeof state.esc === 'function' ? state.esc(title) : title}"`
                          : ''
                      }"`
                      if (width) attrs += ` width="${width}"`
                      if (height) attrs += ` height="${height}"`

                      state.write(`<img ${attrs} />`)
                    }
                    else if (src && src !== 'undefined') {
                      state.write(`![${
                        typeof state.esc === 'function'
                          ? state.esc(alt || '')
                          : (alt || '')
                      }](${src}${
                        title
                          ? ` "${typeof state.esc === 'function' ? state.esc(title) : title}"`
                          : ''
                      })`)
                    }
                  },
                  parse: {
                    // Здесь логика парсинга из Markdown обратно в Node
                    setup(markdownit: any) {
                      // Можно подключить markdown-it-imsize, если он есть в проекте
                    }
                  }
                }
              }
            },
            addAttributes() {
              return {
                ...this.parent?.(),
                src: {
                  default: null,
                  parseHTML: element => element.getAttribute('src'),
                  renderHTML: attributes => ({ src: attributes.src }),
                },
                alt: {
                  default: null,
                  parseHTML: element => element.getAttribute('alt'),
                  renderHTML: attributes => ({ alt: attributes.alt }),
                },
                title: {
                  default: null,
                  parseHTML: element => element.getAttribute('title'),
                  renderHTML: attributes => {
                    if (!attributes.title) return {}
                    return { title: attributes.title }
                  }
                },
                width: {
                  default: null,
                  parseHTML: element => element.getAttribute('width'),
                  renderHTML: attributes => {
                    if (!attributes.width) return {}
                    return {
                      width: attributes.width,
                      style: `width: ${attributes.width}px; height: auto;`
                    }
                  }
                },
                height: {
                  default: null,
                  parseHTML: element => element.getAttribute('height'),
                  renderHTML: attributes => {
                    if (!attributes.height) return {}
                    return {
                      height: attributes.height,
                      style: `height: ${attributes.height}px;`
                    }
                  }
                },
              }
            },
          }).configure({
            inline: true,
            allowBase64: true,
            resize: {
              enabled: true,
              // directions: ['top', 'bottom', 'left', 'right'],
              minHeight: 32,
              minWidth: 32,
              alwaysPreserveAspectRatio: true,
            },
          }),
        ]),
      ],
      // contentType: 'html',
      content: this.value
    })

    // Отслеживание выделения текста
    this.$watch(() => this.editor.state.selection, () => {
      if (this.isEditorLinkActive) {
        const attrs = this.editor.getAttributes('link')
        this.linkUrl = attrs.href || ''
        this.nextTick(() => this.showLinkModal = true, 14)
      }
      else if (!this.showLinkModal) {
        this.linkUrl = ''
      }

      this.bubbleMenuPlacementY = null
      this.showAdditionalButtons = false

      const { from, to, empty } = this.editor.state.selection
      // Не пустой ли курсор. Не является ли текст только пробелами
      const hasTextSelection = !empty && !!this.editor.state.doc.textBetween(from, to).trim()

      if (hasTextSelection || this.isAtEmptyLine) {
        this.showMenu = true // Включается возможность активации меню
      }

      if (this.isEditTable) { // Костыль на костыле костылём погоняет, но работает
        this.enabledTableRowsShowEditorButtons = false
        this.nextTick(() => {
          this.enabledTableRowsShowEditorButtons = true
          this.nextTick(() => {
            this.editor?.commands?.setMeta?.('bubbleMenu', 'updatePosition')
            this.nextTick(() => this.recalculateAdditionalOpenedBlocks)
          }, 7)
        }, 5)
      }
      this.nextTick(() => {
        this.editor?.commands?.setMeta?.('bubbleMenu', 'updatePosition')
        this.nextTick(() => this.recalculateAdditionalOpenedBlocks)
      }, 3)
    })
    this.onViewPortResize()
  }

  simpleBar: typeof SimpleBar|null = null
  onViewPortResize() {
    // if (this.$refs.vstFieldEditor) {
    //   this.nextTick(() => {
    //     const $el = this.$el.querySelector('.tiptap.ProseMirror')
    //     console.log($el)
    //     if ($el) {
    //       this.simpleBar = new SimpleBar($el)
    //     }
    //   }, 13)
    // }
  }

  get isEditTable(): boolean {
    return this.editor?.isActive?.('table')
  }
  get isEditTableEnabled(): boolean {
    return this.isEditTable && this.enabledTableRowsShowEditorButtons
  }
  get isEditorLinkActive(): boolean {
    return this.editor?.isActive?.('link')
  }
  get isSelectingImageResized(): boolean {
    if (!this.editor || !this.editor.isActive('image')) {
      return false
    }
    const attrs = this.editor.getAttributes('image')
    return !!(attrs.width || attrs.height)
  }
  /** Количество символов */
  get charactersCount(): number {
    return (this.editor?.storage?.characterCount?.characters?.() || 0)
  }
  /** Длина строки количества символов */
  get charactersCountLength(): number {
    return this.charactersCount.toString().length
  }
  /** Длина строки количества символов лимита */
  get limitCountLength(): number {
    return this.limit.toString?.()?.length ?? 0
  }
  /** Находится ли пользователь на пустой строке */
  get isAtEmptyLine(): boolean {
    if (!this.editor) return false

    const { selection, doc } = this.editor.state
    const { $from, empty } = selection

    // 1. Проверяем, что выделение — это просто курсор (не выделен текст)
    if (!empty) return false

    // 2. Получаем текущий родительский узел (обычно это 'paragraph')
    const node = $from.parent

    // 3. Проверяем: это параграф и в нем нет текста/других нод
    return node.type.name === 'paragraph'
      && node.content.size === 0
      && !this.editor?.isActive?.('taskList')
      && !this.editor?.isActive?.('bulletList')
      && !this.editor?.isActive?.('orderedList')
  }
  get wordsCount(): number {
    return this.editor?.storage.characterCount.words() || 0
  }

  @Watch watchShowLinkModal(showLinkModal: boolean) {
    this.bubbleMenuPlacementY = null
    this.nextTick(() => {
      this.editor?.commands?.setMeta?.('bubbleMenu', 'updatePosition')
      this.nextTick(() => this.recalculateAdditionalOpenedBlocks)
    })
  }
  @Watch({immediate: true}) watchDisabled(disabled: boolean) {
    this.isEditable = !disabled
  }
  @Watch watchIsEditable(value: boolean) {
    this.editor?.setEditable?.(value)
  }
  @Watch watchIsEditTableEnabled(isEditTable: boolean) {
    this.nextTick(() => {
      this.editor?.commands?.setMeta?.('bubbleMenu', 'updatePosition')
      this.nextTick(this.recalculateAdditionalOpenedBlocks, 2)
    }, 3)
  }

  beforeUnmount() {
    this.editor?.destroy?.()
  }

  onValueChange(value: any) {
    if (this.isFromEditorValueChanged) return this.isFromEditorValueChanged = false
    this.editor?.commands?.setContent?.(value, false)
  }

  getValue(): string {
    if (this.outputFormat === 'markdown') {
      return this.editor.storage.markdown.getMarkdown()
    }
    else {
      return this.editor.getHTML()
    }
  }

  /** Добавление ссылки при наличии в поле ввода */
  addLink() {
    let url = this.linkUrl.trim()
    if (!url) return this.removeLink()

    // Проверка: начинается ли с http://, https://, ftp:// или mailto:
    const hasProtocol = /^(?:f|ht)tps?:\/\/|mailto:/i.test(url)

    if (!hasProtocol) {
      url = `https://${url}`
    }

    this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()

    this.showLinkModal = false
    this.linkUrl = ''
  }

  /** Пересчитать расположение дополнительных блоков к кнопкам */
  recalculateAdditionalOpenedBlocks() {
    const menuEl = document.querySelector('.bubble-menu-top')
    if (!menuEl) return this.bubbleMenuPlacementY ='top'

    // сравнение координат
    const menuRect = menuEl.getBoundingClientRect()
    const view = this.editor.view
    const selection = view.state.selection
    const coords = view.coordsAtPos(selection.from)

    // Если верх меню ниже, чем верх выделенной строки
    this.bubbleMenuPlacementY = menuRect.top > coords.top ? 'bottom' : 'top'
  }

  /** Показывать ли всплывающее меню */
  shouldBubbleMenuShow() {
    this.bubbleMenuPlacementY = null
    return !this.disabled && this.value && (
      (this.editor.isFocused && this.isAtEmptyLine) || (this.editor.isFocused && !this.editor?.state?.selection?.empty)
    )
  }

  /** Удалить ссылку */
  removeLink() {
    this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    this.linkUrl = ''
    this.showLinkModal = false
  }


  /** Открытие блока создания ссылки при клике по кнопке */
  openLinkCreateBlock() {
    if (!this.showLinkModal) {
      this.showLinkModal = true
      this.nextTick(() => {
        this.editor?.commands?.setMeta?.('bubbleMenu', 'updatePosition')
        this.nextTick(this.recalculateAdditionalOpenedBlocks)
        this.nextTick(() => this?.$refs?.linkUrlInput?.focus?.(), 2)
      }, 3)
    }
    else {
      if (this.isEditTable) {
        this.nextTick(() => {
          this.editor?.commands?.setMeta?.('bubbleMenu', 'updatePosition')
          this.nextTick(() => this.recalculateAdditionalOpenedBlocks)
        }, 13)
      }
      this.nextTick(() => this.showLinkModal = false)
    }
  }

  resetValue(e: BaseComponentEventInput) {
    this.preResetValue = this.value
    this.editor.chain().clearContent().focus().run()
  }
  restoreValue(e: BaseComponentEventInput) {
    if (this.preResetValue) {
      this.editor?.commands?.setContent?.(this.value = this.preResetValue, false)
    }
    this.preResetValue = ''
  }

  clickEditor(e: MouseEvent) {
    const target = e.target! // @ts-ignore
    if (target?.tagName === 'A') {
      e.preventDefault() // Останавливает переход

      this.editor.chain().focus().extendMarkRange('link').run()

      // Достаем объект со всеми атрибутами ссылки
      const attrs = this.editor.getAttributes('link')

      // Записываем в реактивные переменные для вашей формы
      this.linkUrl = attrs.href || ''
      // this.linkTarget = attrs.target || '_self' // если использовать target

      this.showLinkModal = true
    }
  }

  /** Изменение размера изображения */
  resetImageSize() {
    const { state, view } = this.editor
    const { selection } = state
    const pos = selection.from
    const node = state.doc.nodeAt(pos)

    if (node && node.type.name === 'image') {
      const domNode = view.nodeDOM(pos) as HTMLElement
      const img = domNode.nodeName === 'IMG' ? (domNode as HTMLImageElement) : domNode.querySelector('img')

      if (img && img.naturalWidth) {
        // ХАК: Напрямую чистим инлайновые стили, которые прописал ресайзер
        img.style.width = ''
        img.style.height = ''
        img.removeAttribute('width')
        img.removeAttribute('height')

        // Если у тебя обертка (div), чистим и её
        if (domNode !== img) {
          domNode.style.width = ''
          domNode.style.height = ''
        }

        // Теперь обновляем атрибуты в Tiptap
        this.editor.chain()
            .focus()
            .updateAttributes('image', {
              width: null,
              height: null,
            })
            .run()
      }
    }
  }

  /**
   * Обработка загрузки изображения
   * @param event
   */
  handleImageUpload(event: ClipboardEvent | DragEvent): boolean {
    const items = 'clipboardData' in event
        ? (event as ClipboardEvent).clipboardData?.items
        : (event as DragEvent).dataTransfer?.files

    if (!items) return false

    // Быстрая проверка на наличие изображения
    const hasImage = Array.from(items as any).some((item: any) =>
        (item.type || '').startsWith('image')
    )

    if (hasImage) {
      event.preventDefault() // Синхронно блокируем стандартную вставку

      // Запускаем асинхронную цепочку без await
      this.processImageAsync(items)

      return true // Сообщаем редактору, что мы перехватили событие
    }

    return false
  }

  async processImageAsync(items: DataTransferItemList | FileList) {
    try {
      this.loading = true // Если есть индикатор загрузки в VST

      let file: File | null = null
      // Извлекаем файл (логика как была)
      const fileItem = Array.from(items as any).find((i: any) =>
          (i instanceof File ? i.type : i.type).startsWith('image')
      )
      file = (fileItem instanceof DataTransferItem ? fileItem.getAsFile() : fileItem) as any

      if (!file) return

      // Сжимаем
      let finalSrc = await this.compressImage(file)

      // Опционально загружаем на сервер через пропс-коллбек
      if (this.onImageUpload) {
        finalSrc = await this.onImageUpload(file)
      }

      // Вставляем в редактор
      this.editor.chain().focus().setImage({ src: finalSrc }).run()

    } catch (e) {
      console.error('VST Editor Error:', e)
    } finally {
      this.loading = false
    }
  }

  /**
   * Сжатие изображения перед вставкой
   * @param file
   */
  async compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new globalThis.Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          // Лимитируем максимальную ширину для ERP (например, 1200px)
          const maxWidth = 1200
          let width = img.width
          let height = img.height

          if (width > maxWidth) {
            height = (maxWidth / width) * height
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)

          // Конвертируем в WebP с качеством 80%
          const webpBase64 = canvas.toDataURL('image/webp', 0.95)
          resolve(webpBase64)
        }
      }
      reader.onerror = (e) => reject(e)
    })
  }

}
</script>

<style lang="sass">
@import "simplebar/dist/simplebar.min.css"
.vst-field-editor
  .simplebar-content-wrapper
    overflow-x: hidden !important // Скрытие горизонтальной прокрутки редактора
  .tiptap
    @apply overflow-hidden!
    height: fit-content !important
    overflow-y: auto     /* Разрешаем внутренний скролл */
    padding: 10px        /* Внутренние отступы для текста */
    min-height: 135px
    outline: none
    //display: block !important

    :first-child
      margin-top: 0

    img
      display: block

    [data-resize-handle]
      position: absolute
      background: rgba(0, 0, 0, 0.5)
      border: 1px solid rgba(255, 255, 255, 0.8)
      border-radius: 2px
      z-index: 10

      &:hover
        background: rgba(0, 0, 0, 0.8)

      /* Corner handles */
      &[data-resize-handle='top-left'],
      &[data-resize-handle='top-right'],
      &[data-resize-handle='bottom-left'],
      &[data-resize-handle='bottom-right']
        width: 8px
        height: 8px

      &[data-resize-handle='top-left']
        top: -4px
        left: -4px
        cursor: nwse-resize

      &[data-resize-handle='top-right']
        top: -4px
        right: -4px
        cursor: nesw-resize

      &[data-resize-handle='bottom-left']
        bottom: -4px
        left: -4px
        cursor: nesw-resize

      &[data-resize-handle='bottom-right']
        bottom: -4px
        right: -4px
        cursor: nwse-resize

      /* Edge handles */
      &[data-resize-handle='top'],
      &[data-resize-handle='bottom']
        height: 6px
        left: 8px
        right: 8px

      &[data-resize-handle='top']
        top: -3px
        cursor: ns-resize

      &[data-resize-handle='bottom']
        bottom: -3px
        cursor: ns-resize

      &[data-resize-handle='left'],
      &[data-resize-handle='right']
        width: 6px
        top: 8px
        bottom: 8px

      &[data-resize-handle='left']
        left: -3px
        cursor: ew-resize

      &[data-resize-handle='right']
        right: -3px
        cursor: ew-resize

    .tableWrapper
      @apply border-stone-500/30 border-solid border-1px rounded-lg
      margin: 1.5rem 0
      overflow-x: auto


      &.resize-cursor
        cursor: col-resize

      [data-resize-state='true'] [data-resize-wrapper]
        outline: 1px solid rgba(0, 0, 0, 0.25)
        border-radius: 0.125rem
    ul[data-type="taskList"]
      list-style: none
      li
        display: flex
        align-items: center
        label
          flex: 0 0 auto
          margin-right: 0.5rem
          user-select: none
        div
          flex: 1 1 auto

    /* Table-specific styling */
    table
      @apply border-solid rounded-md border-stone-500/20
      margin: 0
      overflow: hidden
      table-layout: fixed
      width: 100%

      th
        @apply border-b-solid border-stone-500/20 bg-stone-100!
      td:not(:last-child)
        @apply border-r-solid border-stone-500/20
      tr:not(:last-child)
        td
          @apply border-b-solid border-stone-500/30
      td,
      th
        box-sizing: border-box
        min-width: 1em
        padding: 6px 8px
        position: relative
        vertical-align: top

        > *
          margin-bottom: 0

      th
        background-color: var(--gray-1)
        font-weight: bold
        text-align: left

      .selectedCell:after
        background: var(--gray-2)
        content: ''
        left: 0
        right: 0
        top: 0
        bottom: 0
        pointer-events: none
        position: absolute
        z-index: 2

      .column-resize-handle
        background-color: var(--purple)
        bottom: -2px
        pointer-events: none
        position: absolute
        right: -2px
        top: 0
        width: 4px

.bubble-menu
  @apply flex z1000
.vst-field-editor
  .bubble-menu-top
    @apply flex w100% bg-stone-200/90 border-solid border-1px border-stone/50 px16px pt6px pb10px
    @apply border-dashed mx5px z100 flex-col
  p.is-editor-empty:first-child::before
    color: #c1c7cf
    content: attr(data-placeholder)
    float: left
    height: 0
    pointer-events: none

  .tiptap.ProseMirror
    @apply bg-transparent! overflow-y-auto!
    @apply py8px px25px ou-none resize-none fs-1rem
    @apply my1px outline-none! border-none! h-100%!
    //scrollbar-width: thin
    //scrollbar-color: #808080 transparent
    //-webkit-appearance: none
    //border: 1px solid #c1c7cf
    //transition: border 0.3s ease
    //scrollbar-gutter: stable
    :first-child
      margin-top: 0

    ul
      list-style-type: disc // Явно указываем маркеры-точки для ul
    ol
      list-style-type: decimal // Явно указываем номера для ol
    ul, ol
      @apply px-7! mx-0! my-1! py-1px! rounded-xl fs-1.05rem
    ul li::marker,
    ol li::marker
      font-weight: bold
    ul li,
    ol li
      font-weight: normal
    // Если этого недостаточно, используйте более специфичный селектор
    ul li
      list-style-type: disc
      > ul li
        list-style-type: circle !important

    ol li
      list-style-type: decimal
      //> ol li
      //  list-style-type: lower-alpha !important

    /* List styles */
    ul,
    ol
      padding: 0 1rem
      margin: 1.25rem 1rem 1.25rem 0.4rem
      // Здесь могут быть конфликты, поэтому важно, чтобы list-style-type
      // был указан после возможного reset-стиля

      li p
        margin-top: 0.25em
        margin-bottom: 0.25em

    /* Code and preformatted text styles */
    code
      background-color: var(--purple-light)
      border-radius: 0.4rem
      color: var(--black)
      font-size: 0.85rem
      padding: 0.25em 0.3em


    pre
      background: var(--black)
      border-radius: 0.5rem
      color: var(--white)
      font-family: 'JetBrainsMono', monospace
      margin: 1.5rem 0
      padding: 0.75rem 1rem

      code
        background: none
        color: inherit
        font-size: 0.8rem
        padding: 0


    blockquote
      border-left: 3px solid var(--gray-3)
      margin: 1.5rem 0
      padding-left: 1rem

    hr
      border: none
      border-top: 1px solid var(--gray-2)
      margin: 2rem 0

    *
      white-space: pre-wrap !important
      word-wrap: break-word !important
    &::-webkit-scrollbar
      visibility: hidden
      width: 4px
    &::placeholder
      color: #c1c7cf
    &:disabled
      cursor: not-allowed
      background: #f7f7f7
      border: #e5e5e5 1px solid !important

    &.ProseMirror-focused
      //outline: 1px solid #fff !important
      //border: 1px solid #fff !important
      @apply outline-none! border-none!
    &.is-valid
      border: 2px solid #80d1b3
      &.ProseMirror-focused
        outline: 2px solid #80d1b3 !important
    &.is-invalid
      border: 2px solid #ff6464
      &.ProseMirror-focused
        outline: 2px solid #ff6464 !important
      &::placeholder
        @apply text-red-400
    &::placeholder
      color: #c1c7cf
    p:first-child
      @apply mt3px
    p:not(:first-child)
      margin: 6px 2px !important
</style>
