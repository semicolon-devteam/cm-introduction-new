/**
 * Contacts API Client Factory
 *
 * 환경에 따라 적절한 API Client 구현체를 반환
 */

import type { ContactsApiClient } from "./interfaces";
import { NextContactsService } from "./implementations";

function createContactsClient(): ContactsApiClient {
  // 현재는 Next.js API Route만 지원
  // 추후 Spring Boot API 등 다른 백엔드 추가 가능
  return new NextContactsService();
}

export const contactsClient = createContactsClient();
