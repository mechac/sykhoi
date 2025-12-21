import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import CommandStart
from aiogram.types import (
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
    InlineQueryResultPhoto
)
from aiogram.methods import SavePreparedInlineMessage
from env import BOT_TOKEN, MINI_APP_URL, IMAGE_URL

logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    user_id = message.from_user.id
    username = message.from_user.username or "Пользователь"

    try:
        # Генерируем уникальное подготовленное сообщение
        # Кнопка внутри карточки ведет в бота, чтобы замкнуть цикл виральности
        bot_user = await bot.get_me()
        share_url = f"https://t.me/{bot_user.username}?start=ref_{user_id}"

        result = await bot(SavePreparedInlineMessage(
            user_id=user_id,
            result=InlineQueryResultPhoto(
                id=f"share_{user_id}_{message.message_id}",
                photo_url=IMAGE_URL,
                thumbnail_url=IMAGE_URL,
                title="🎨 Темы для Telegram",
                description="Получай рандомные темы каждые 24 часа!",
                caption=(
                    f"<b>🙈 Привет от {username}!</b>\n\n"
                    "<i>Хочешь получить крутую тему для оформления Telegram?</i>\n"
                    "Жми на кнопку ниже и забирай свою!"
                ),
                parse_mode="HTML",
                reply_markup=InlineKeyboardMarkup(
                    inline_keyboard=[[
                        InlineKeyboardButton(text="🎨 Получить тему", url=share_url)
                    ]]
                )
            ),
            allow_user_chats=True,
            allow_bot_chats=True,
            allow_group_chats=True,
            allow_channel_chats=True
        ))

        # Важно: передаем полученный ID в URL мини-аппа
        app_url_with_id = f"{MINI_APP_URL}?message_id={result.id}"
        logging.info(f"Prepared ID for {user_id}: {result.id}")

    except Exception as e:
        logging.error(f"Error creating prepared message: {e}")
        app_url_with_id = MINI_APP_URL

    keb = InlineKeyboardMarkup(
        inline_keyboard=[[
            InlineKeyboardButton(
                text='🎨 Открыть Темы', 
                web_app=WebAppInfo(url=app_url_with_id)
            )
        ]]
    )

    await message.answer(
        text=f"Привет, <b>{username}</b>! 🎉\nЧтобы выполнить задания и получить тему, открой приложение:",
        reply_markup=keb,
        parse_mode="HTML"
    )

async def main():
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
