CREATE TYPE "public"."user_role" AS ENUM('admin', 'teacher', 'student');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" text,
	"email_verified_at" timestamp with time zone,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_accounts" (
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_user_id" text NOT NULL,
	CONSTRAINT "user_accounts_user_id_provider_user_id_pk" PRIMARY KEY("user_id","provider_user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone_number" varchar,
	"picture" text,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_student_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"parent_phone_number" varchar NOT NULL,
	"address" text NOT NULL,
	"grade" varchar NOT NULL,
	"school" varchar NOT NULL,
	"target_university" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"opened_at" timestamp with time zone,
	"closed_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cbt_id" uuid NOT NULL,
	"cbt_subject_id" uuid NOT NULL,
	"duration" integer DEFAULT 5400000 NOT NULL,
	"score_on_correct" integer DEFAULT 3 NOT NULL,
	"score_on_wrong" integer DEFAULT 0 NOT NULL,
	"score_on_null" integer DEFAULT 0 NOT NULL,
	"should_shuffle_questions" boolean DEFAULT false NOT NULL,
	"should_shuffle_question_options" boolean DEFAULT false NOT NULL,
	"description" text,
	"questions_count" integer,
	"options_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_module_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cbt_module_id" uuid NOT NULL,
	"image" text,
	"text" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_module_question_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cbt_module_question_id" uuid NOT NULL,
	"is_answer" boolean DEFAULT false NOT NULL,
	"image" text,
	"text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_members" (
	"user_id" uuid NOT NULL,
	"cbt_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cbt_members_user_id_cbt_id_pk" PRIMARY KEY("user_id","cbt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_module_members" (
	"user_id" uuid NOT NULL,
	"cbt_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cbt_module_members_user_id_cbt_id_pk" PRIMARY KEY("user_id","cbt_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"cbt_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cbt_participations_cbt_id_user_id_unique" UNIQUE("cbt_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_participation_results" (
	"cbt_participations_id" uuid PRIMARY KEY NOT NULL,
	"finished_at" timestamp with time zone DEFAULT now() NOT NULL,
	"total_score" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_module_participations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cbt_participation_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_module_participation_results" (
	"cbt_module_participation_id" uuid PRIMARY KEY NOT NULL,
	"finished_at" timestamp with time zone DEFAULT now() NOT NULL,
	"corrent_count" integer,
	"incorrent_count" integer,
	"null_count" integer,
	"total_score" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cbt_module_question_answers" (
	"cbt_module_participation_id" uuid NOT NULL,
	"cbt_module_question_id" uuid NOT NULL,
	"cbt_module_question_option_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attachment_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"mime_type" varchar NOT NULL,
	"size" integer NOT NULL,
	"path" text NOT NULL,
	"url" text NOT NULL,
	"checksum" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attachment_file_id" uuid NOT NULL,
	"table" text NOT NULL,
	"tableId" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attachments_attachment_file_id_table_tableId_unique" UNIQUE("attachment_file_id","table","tableId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "array_orderable" (
	"reference_id" uuid NOT NULL,
	"orderable" varchar NOT NULL,
	"reference_type" varchar NOT NULL,
	"ids" uuid[] DEFAULT ARRAY[]::uuid[] NOT NULL,
	CONSTRAINT "array_orderable_orderable_reference_id_reference_type_pk" PRIMARY KEY("orderable","reference_id","reference_type")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_student_profiles" ADD CONSTRAINT "user_student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_modules" ADD CONSTRAINT "cbt_modules_cbt_id_cbts_id_fk" FOREIGN KEY ("cbt_id") REFERENCES "public"."cbts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_modules" ADD CONSTRAINT "cbt_modules_cbt_subject_id_cbt_subjects_id_fk" FOREIGN KEY ("cbt_subject_id") REFERENCES "public"."cbt_subjects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_questions" ADD CONSTRAINT "cbt_module_questions_cbt_module_id_cbt_modules_id_fk" FOREIGN KEY ("cbt_module_id") REFERENCES "public"."cbt_modules"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_question_options" ADD CONSTRAINT "cbt_module_question_options_cbt_module_question_id_cbt_module_questions_id_fk" FOREIGN KEY ("cbt_module_question_id") REFERENCES "public"."cbt_module_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_members" ADD CONSTRAINT "cbt_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_members" ADD CONSTRAINT "cbt_members_cbt_id_cbts_id_fk" FOREIGN KEY ("cbt_id") REFERENCES "public"."cbts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_members" ADD CONSTRAINT "cbt_module_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_members" ADD CONSTRAINT "cbt_module_members_cbt_id_cbts_id_fk" FOREIGN KEY ("cbt_id") REFERENCES "public"."cbts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_participations" ADD CONSTRAINT "cbt_participations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_participations" ADD CONSTRAINT "cbt_participations_cbt_id_cbts_id_fk" FOREIGN KEY ("cbt_id") REFERENCES "public"."cbts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_participation_results" ADD CONSTRAINT "cbt_participation_results_cbt_participations_id_cbt_participations_id_fk" FOREIGN KEY ("cbt_participations_id") REFERENCES "public"."cbt_participations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_participations" ADD CONSTRAINT "cbt_module_participations_cbt_participation_id_cbt_participations_id_fk" FOREIGN KEY ("cbt_participation_id") REFERENCES "public"."cbt_participations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_participation_results" ADD CONSTRAINT "cbt_module_participation_results_cbt_module_participation_id_cbt_module_participations_id_fk" FOREIGN KEY ("cbt_module_participation_id") REFERENCES "public"."cbt_module_participations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_question_answers" ADD CONSTRAINT "cbt_module_question_answers_cbt_module_participation_id_cbt_module_participations_id_fk" FOREIGN KEY ("cbt_module_participation_id") REFERENCES "public"."cbt_module_participations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_question_answers" ADD CONSTRAINT "cbt_module_question_answers_cbt_module_question_id_cbt_module_questions_id_fk" FOREIGN KEY ("cbt_module_question_id") REFERENCES "public"."cbt_module_questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cbt_module_question_answers" ADD CONSTRAINT "cbt_module_question_answers_cbt_module_question_option_id_cbt_module_question_options_id_fk" FOREIGN KEY ("cbt_module_question_option_id") REFERENCES "public"."cbt_module_question_options"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attachments" ADD CONSTRAINT "attachments_attachment_file_id_attachment_files_id_fk" FOREIGN KEY ("attachment_file_id") REFERENCES "public"."attachment_files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
